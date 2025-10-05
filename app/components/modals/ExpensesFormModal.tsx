'use client'

import { ResponseCacheContext } from '@/app/context/cacheContext'
import { AppContext } from '@/app/context/context'
import useAlert from '@/app/hook/useAlert'
import useCredit from '@/app/hook/useCredit'
import { DeleteIcon, EyeHiddenIcon } from '@/app/icons/icons'
import {
    ExpenseFormType,
    ExpensesModalType,
    StatusType,
    TodaysExpensesType,
} from '@/app/types/type'
import { CustomLogger, LogLevel } from '@/app/utils/logger'
import {
    CURRENT_MONTHID,
    CURRENT_YEAR,
    formatMoney,
    iconFilterModerator,
} from '@/app/utils/utils'
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Tooltip,
} from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { memo, useCallback, useEffect, useState } from 'react'

const DEFAULT_FORM: ExpenseFormType = {
    ID: 0,
    categoryID: '1',
    description: '',
    amount: '',
    header: 'Add New Expense',
    status: 1,
}

interface Info {
    hasError: boolean
    message: string
}

interface Validator {
    categoryID: Info
    amount: Info
}

const DEFAULT_VALIDATOR_VALUE: Validator = {
    categoryID: {
        hasError: false,
        message: '',
    },
    amount: {
        hasError: false,
        message: '',
    },
}

const ExpensesFormModal = ({
    isOpen,
    onOpenChange,
    data,
    canHide,
    onHide,
    afterHandler,
}: ExpensesModalType<TodaysExpensesType>) => {
    const { data: session } = useSession()
    const context = AppContext()
    const {
        handleUpdateExpense,
        isTodayExpensePending,
        categories,
        selectedColor,
        mode,
    } = context

    const cacheContext = ResponseCacheContext()
    const { totalBalance } = useCredit()
    const [formData, setFormData] = useState<ExpenseFormType>(DEFAULT_FORM)
    const { showAlert } = useAlert()
    const [availableCredit, setAvailableCredit] = useState(0)

    const [validator, setValidator] = useState<Validator>(
        DEFAULT_VALIDATOR_VALUE
    )

    const handleChangeInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
            const { name, value } = e.target

            if (name === 'status') {
                const statusValue = value ? +value : 1
                setFormData({ ...formData, [name]: statusValue })
            } else {
                setFormData({ ...formData, [name]: value })

                if (['categoryID', 'amount'].includes(name)) {
                    setValidator((prev) => ({
                        ...prev,
                        [name]: {
                            hasError: false,
                            message: '',
                        },
                    }))
                }
            }
        },
        [data, setFormData, formData]
    )

    const handleSave = useCallback(
        (onClose: () => void, data = formData): void => {
            const { ID, amount, categoryID, description, status } = data
            const currentAmount = Number(amount)

            const categoryValidation = {
                hasError: !Boolean(categoryID),
                message: '',
            }

            const amountValidation = {
                hasError: !Boolean(amount),
                message: '',
            }

            if (categoryID !== '' && Number(amount) >= 0 && amount !== '') {
                isTodayExpensePending.current = true

                const ACTION_TYPE = ID === DEFAULT_FORM.ID ? 'add' : 'edit'

                const categoryList = categories?.find(
                    (cat) => cat.ID === Number(categoryID)
                )

                const newExpense: TodaysExpensesType = {
                    ID,
                    category: categoryList?.description,
                    categoryID: Number(categoryID),
                    description,
                    amount: Number(amount),
                    created_by: session?.user?.email || '',
                    created_on: `${new Date()}`,
                    status: status as StatusType,
                }

                if (currentAmount > availableCredit) {
                    amountValidation.hasError = true
                    amountValidation.message = `Error! Insufficient balance! ${formatMoney(
                        availableCredit - currentAmount
                    )}`
                } else if (currentAmount < 0 && amount !== '') {
                    amountValidation.hasError = true
                    amountValidation.message = 'Error! Invalid amount!'
                } else {
                    handleUpdateExpense(newExpense, ACTION_TYPE)
                        .then(() => {
                            const alertMessage =
                                ACTION_TYPE === 'add'
                                    ? 'New expense has been added!'
                                    : 'Expense has been updated!'

                            setFormData(DEFAULT_FORM)
                            showAlert({
                                type: 'success',
                                message: alertMessage,
                            })

                            if (cacheContext) {
                                const { removeCacheByID } = cacheContext
                                const cachedID = `${CURRENT_MONTHID}-${CURRENT_YEAR}-mel`
                                removeCacheByID(cachedID)
                            }

                            onClose()
                        })
                        .catch((error) => {
                            showAlert({
                                type: 'error',
                                message: 'Something went wrong!',
                            })
                            const logger = new CustomLogger(LogLevel.ERROR)
                            logger.error(error)
                        })
                }

                isTodayExpensePending.current = false
            } else {
                categoryValidation.message = Boolean(categoryID)
                    ? ''
                    : 'Required field'
                amountValidation.message = Boolean(amount)
                    ? ''
                    : 'Required field'
            }

            setValidator({
                categoryID: categoryValidation,
                amount: amountValidation,
            })

            if (afterHandler) {
                afterHandler(data)
            }
        },
        [afterHandler, showAlert, session, cacheContext]
    )

    const handleKeyPress = useCallback(
        (
            { key }: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent,
            onClose: () => void
        ): void => {
            if (key === 'Enter') {
                handleSave(onClose)
            }
        },
        [handleSave]
    )

    const handleHideExpense = useCallback((onClose: () => void) => {
        if (data) {
            onHide?.(data)
            onClose()
        }
    }, [])

    useEffect(() => {
        let totalAmount = 0
        const defaultValue: ExpenseFormType = {
            ...DEFAULT_FORM,
            description: Boolean(mode)
                ? `${mode} | `
                : DEFAULT_FORM.description,
        }

        if (data) {
            const { ID, amount, categoryID, description, status } = data
            setFormData({
                ID,
                amount: amount.toString(),
                categoryID: categoryID.toString(),
                description: description ?? '',
                header: 'Update Expense',
                status: status ?? 1,
            })

            totalAmount = amount
        } else {
            setFormData(defaultValue)
        }
        setAvailableCredit(totalAmount + totalBalance)

        return () => {
            setFormData(defaultValue)
            setValidator(DEFAULT_VALIDATOR_VALUE)
            setAvailableCredit(0)
        }
    }, [isOpen, data])

    const isEditing = formData.header === 'Update Expense'

    return (
        <Modal
            style={{
                backgroundColor: selectedColor.properties.secondaryAccent,
                border: `1px solid ${selectedColor.properties.borderColor}`,
            }}
            backdrop="blur"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 font-bold">
                            {formData.header}
                        </ModalHeader>
                        <ModalBody>
                            {categories && (
                                <Select
                                    label="Select category"
                                    variant="bordered"
                                    color={selectedColor.background}
                                    isRequired
                                    selectedKeys={[formData.categoryID]}
                                    onChange={handleChangeInput}
                                    isInvalid={validator.categoryID.hasError}
                                    errorMessage={
                                        validator.categoryID.hasError &&
                                        validator.categoryID.message
                                    }
                                    name="categoryID"
                                >
                                    {categories.map((category) => (
                                        <SelectItem
                                            color={selectedColor.background}
                                            startContent={
                                                <Image
                                                    src={
                                                        require(`@/public/assets/icons/${category.imgPath}.png`)
                                                            .default
                                                    }
                                                    alt="icon"
                                                    height={27}
                                                    style={{
                                                        filter: iconFilterModerator(
                                                            selectedColor.background
                                                        ),
                                                    }}
                                                />
                                            }
                                            key={category.ID}
                                            value={category.ID}
                                        >
                                            {category.description}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                            <Input
                                value={formData.description}
                                onChange={handleChangeInput}
                                onKeyDown={(event) =>
                                    handleKeyPress(event, onClose)
                                }
                                name="description"
                                label="Short description"
                                placeholder="Enter short description"
                                variant="bordered"
                                color={selectedColor.background}
                            />
                            <Input
                                value={formData.amount}
                                onChange={handleChangeInput}
                                onKeyDown={(event) =>
                                    handleKeyPress(event, onClose)
                                }
                                name="amount"
                                isInvalid={validator.amount.hasError}
                                errorMessage={
                                    validator.amount.hasError &&
                                    validator.amount.message
                                }
                                autoFocus
                                color={selectedColor.background}
                                isRequired
                                label="Amount"
                                type="number"
                                placeholder="Enter amount"
                                variant="bordered"
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">
                                            ₱
                                        </span>
                                    </div>
                                }
                            />
                        </ModalBody>
                        <ModalFooter
                            className={`flex items-center ${
                                isEditing ? 'justify-between' : 'justify-end'
                            } `}
                        >
                            <div className="flex items-center gap-4">
                                {isEditing && (
                                    <Tooltip content="Delete">
                                        <Button
                                            isIconOnly
                                            aria-label="Delete"
                                            color="danger"
                                            size="sm"
                                            variant="light"
                                            onPress={() =>
                                                handleSave(onClose, {
                                                    ...formData,
                                                    status: 0,
                                                })
                                            }
                                        >
                                            <DeleteIcon size="xs" />
                                        </Button>
                                    </Tooltip>
                                )}

                                {canHide && (
                                    <Tooltip content="Hide">
                                        <Button
                                            isIconOnly
                                            aria-label="Delete"
                                            color="warning"
                                            size="sm"
                                            variant="light"
                                            onPress={() =>
                                                handleHideExpense(onClose)
                                            }
                                        >
                                            <EyeHiddenIcon size="xs" />
                                        </Button>
                                    </Tooltip>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="light"
                                    color="danger"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                                <Button
                                    color={selectedColor.background}
                                    onPress={() => handleSave(onClose)}
                                >
                                    Save
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default memo(ExpensesFormModal)
