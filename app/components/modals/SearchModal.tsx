"use client"

import { SearchIcon } from "@/app/icons/icons"
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react"
import React, { ChangeEvent, memo, useCallback, useState } from "react"
import useDelay from "@/app/hook/useDelay"
import SearchResults from "./SearchResults"

type TModal = {
  isOpen: boolean
  onOpenChange: () => void
}
const SearchModal = (props: TModal) => {
  const { isOpen, onOpenChange } = props

  const [query, setQuery] = useState("")
  const deferredQuery = useDelay(query, 1000)

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }, [])

  return (
    <Modal
      className="border-1 border-border-color bg-container-secondary"
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      hideCloseButton
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <Input
                variant="bordered"
                color="primary"
                label="Search Expenses"
                autoFocus
                isClearable
                onClear={() => setQuery("")}
                value={query}
                radius="lg"
                onChange={handleInputChange}
                placeholder="Type to search..."
                startContent={<SearchIcon />}
              />
            </ModalHeader>
            <ModalBody className="min-h-80">
              {/* <SearchResults query={deferredQuery} /> */}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default memo(SearchModal)
