'use client'

import { AppContext } from '@/app/context/context'
import { DeleteIcon } from '@/app/icons/icons'
import { setCookie } from '@/app/utils/helper'
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from '@nextui-org/react'
import { useState } from 'react'

export default function Mode() {
    const context = AppContext()
    const { selectedColor, mode, setMode } = context

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [modeValue, setModeValue] = useState(mode)
    const [isInvalid, setIsInvalid] = useState(false)

    const handleSave = () => {
        if (Boolean(modeValue)) {
            setCookie('mode', modeValue)
            setMode(modeValue)
            onClose()
        } else {
            setIsInvalid(true)
        }
    }

    const handleDelete = () => {
        setMode('')
        onClose()
    }

    const handleCancel = () => {
        setMode(mode)
        onClose()
    }

    const hasMode = Boolean(mode)

    return (
        <>
            <div className="flex items-center justify-between">
                <span className="ml-3">Mode</span>
                <Button
                    variant="light"
                    color={selectedColor.background}
                    onPress={onOpen}
                >
                    {hasMode ? mode : 'None'}
                </Button>
            </div>
            <Modal
                style={{
                    backgroundColor: selectedColor.properties.secondaryAccent,
                    border: `1px solid ${selectedColor.properties.borderColor}`,
                }}
                backdrop="blur"
                isOpen={isOpen}
                size="sm"
                placement="center"
                onClose={onClose}
            >
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {hasMode ? 'Update Mode' : 'Create Mode'}
                            </ModalHeader>
                            <ModalBody className="flex flex-col gap-5">
                                <Input
                                    label="Title"
                                    value={modeValue}
                                    onChange={(e) => {
                                        setModeValue(e.target.value)
                                        setIsInvalid(false)
                                    }}
                                    className="max-w-xs"
                                    color={selectedColor.background}
                                    isRequired
                                    isInvalid={isInvalid}
                                    variant="bordered"
                                    onKeyUp={(e) => {
                                        if (e.code === 'Enter') {
                                            handleSave()
                                        }
                                    }}
                                />
                                <small className="text-justify">
                                    Note: This will automatically be displayed
                                    in the{' '}
                                    <i
                                        className={`text-${selectedColor.background}`}
                                    >
                                        Description
                                    </i>{' '}
                                    section when adding new expenses.
                                </small>
                            </ModalBody>
                            <ModalFooter
                                className={`flex items-center ${
                                    hasMode ? 'justify-between' : 'justify-end'
                                } `}
                            >
                                {hasMode && (
                                    <Button
                                        isIconOnly
                                        aria-label="Delete"
                                        color="danger"
                                        size="sm"
                                        variant="light"
                                        onPress={handleDelete}
                                    >
                                        <DeleteIcon size="xs" />
                                    </Button>
                                )}

                                <div className="flex items-center gap-2">
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={handleCancel}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        color={selectedColor.background}
                                        onPress={handleSave}
                                    >
                                        {hasMode ? 'Update' : 'Set mode'}
                                    </Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
