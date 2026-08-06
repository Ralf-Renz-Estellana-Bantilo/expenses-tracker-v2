-- RPC functions called from Next.js API routes via supabase.rpc('name', {...args}).
-- All are SECURITY INVOKER + STABLE so they respect RLS and can be planner-optimized.
-- Each takes p_user (email) explicitly for now; when migrating to Supabase Auth + RLS,
-- swap p_user for auth.jwt() ->> 'email' and remove the parameter.

--------------------------------------------------------------------------------
-- daily_summary: number of days with expenses this year, total, and daily avg
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION daily_summary(p_user text)
RETURNS TABLE (
  "numberOfDays" numeric,
  "totalExpenses" numeric,
  "dailyAverage" numeric
)
LANGUAGE sql STABLE SECURITY INVOKER AS $$
  SELECT
    COUNT(amount)::numeric                               AS "numberOfDays",
    ROUND(SUM(amount), 2)                                AS "totalExpenses",
    ROUND(SUM(amount) / NULLIF(COUNT(amount), 0), 2)     AS "dailyAverage"
  FROM daily_expenses_view
  WHERE EXTRACT(YEAR FROM created_on AT TIME ZONE 'Asia/Manila')::int
        = EXTRACT(YEAR FROM now() AT TIME ZONE 'Asia/Manila')::int
    AND created_by = p_user;
$$;

--------------------------------------------------------------------------------
-- monthly_average: avg monthly total for the user, excluding current month
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION monthly_average(p_user text)
RETURNS TABLE (
  "user"           text,
  monthly_average  numeric
)
LANGUAGE sql STABLE SECURITY INVOKER AS $$
  SELECT
    mon."user"::text                                             AS "user",
    ROUND(SUM(mon.total) / NULLIF(COUNT(mon."user"), 0), 2)      AS monthly_average
  FROM monthly_expenses_view mon
  WHERE mon.year = EXTRACT(YEAR FROM now() AT TIME ZONE 'Asia/Manila')::int
    AND mon."monthID" <> EXTRACT(MONTH FROM now() AT TIME ZONE 'Asia/Manila')::int
    AND mon."user" = p_user
  GROUP BY mon."user";
$$;

--------------------------------------------------------------------------------
-- monthly_percentage_breakdown: per-category share of a given month's total
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION monthly_percentage_breakdown(
  p_user text,
  p_month int,
  p_year int
)
RETURNS TABLE (
  "categoryID"    bigint,
  category        varchar,
  "monthID"       int,
  total           numeric,
  monthly_total   numeric,
  percentage      numeric,
  created_by      varchar
)
LANGUAGE sql STABLE SECURITY INVOKER AS $$
  SELECT
    exp."categoryID",
    exp.category,
    EXTRACT(MONTH FROM exp.created_on AT TIME ZONE 'Asia/Manila')::int AS "monthID",
    SUM(exp.amount::numeric)                                            AS total,
    mon.total                                                           AS monthly_total,
    ROUND((SUM(exp.amount::numeric) / NULLIF(mon.total, 0)) * 100, 2)   AS percentage,
    exp.created_by
  FROM expenses_view exp
  LEFT JOIN monthly_expenses_view mon
    ON exp.created_by = mon."user"
   AND mon."monthID" = EXTRACT(MONTH FROM exp.created_on AT TIME ZONE 'Asia/Manila')::int
   AND mon.year      = EXTRACT(YEAR  FROM exp.created_on AT TIME ZONE 'Asia/Manila')::int
  WHERE exp.created_by = p_user
    AND mon."monthID"  = p_month
    AND mon.year       = p_year
  GROUP BY exp."categoryID", exp.category, mon.total, exp.created_by,
           EXTRACT(MONTH FROM exp.created_on AT TIME ZONE 'Asia/Manila');
$$;

--------------------------------------------------------------------------------
-- past_week_expenses: all expenses on the 7 most recent distinct days
-- (excluding today), for the given user
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION past_week_expenses(p_user text)
RETURNS TABLE (
  "ID"          bigint,
  "categoryID"  bigint,
  "imgPath"     varchar,
  category      varchar,
  description   varchar,
  amount        varchar,
  status        smallint,
  created_by    varchar,
  created_on    timestamptz,
  updated_on    timestamptz,
  date          date
)
LANGUAGE sql STABLE SECURITY INVOKER AS $$
  WITH last_seven_days AS (
    SELECT DISTINCT (created_on AT TIME ZONE 'Asia/Manila')::date AS day
    FROM expenses_view
    WHERE created_by = p_user
      AND (created_on AT TIME ZONE 'Asia/Manila')::date <> app_today()
    ORDER BY day DESC
    LIMIT 7
  )
  SELECT
    exp."ID", exp."categoryID", exp."imgPath", exp.category,
    exp.description, exp.amount, exp.status,
    exp.created_by, exp.created_on, exp.updated_on,
    (exp.created_on AT TIME ZONE 'Asia/Manila')::date AS date
  FROM expenses_view exp
  INNER JOIN last_seven_days d
    ON (exp.created_on AT TIME ZONE 'Asia/Manila')::date = d.day
  WHERE exp.created_by = p_user;
$$;

--------------------------------------------------------------------------------
-- summary_totals: total expenses, total budget, and remaining balance
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION summary_totals(p_user text)
RETURNS TABLE (
  "totalExpenses"  numeric,
  "totalBudget"    numeric,
  "totalBalance"   numeric
)
LANGUAGE sql STABLE SECURITY INVOKER AS $$
  WITH expense_sum AS (
    SELECT COALESCE(SUM(amount::numeric), 0) AS total
    FROM expenses_view
    WHERE created_by = p_user
  ),
  budget_sum AS (
    SELECT COALESCE(SUM(amount::numeric), 0) AS total
    FROM wallet_budget
    WHERE created_by = p_user
  )
  SELECT
    ROUND(e.total, 2)             AS "totalExpenses",
    ROUND(b.total, 2)             AS "totalBudget",
    ROUND(b.total - e.total, 2)   AS "totalBalance"
  FROM expense_sum e, budget_sum b;
$$;
