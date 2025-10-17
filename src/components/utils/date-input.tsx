"use client"

import * as React from "react"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"

function formatDate(date: Date | undefined) {
    if (!date) {
        return ""
    }

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

function isValidDate(date: Date | undefined) {
    if (!date) {
        return false
    }
    return !isNaN(date.getTime())
}

interface DateInputProps {
    id: string;
    defaultValue?: any;
    onChange?: (value: string) => void;
    disabled?: boolean;
    // Add new props for more control
    minDate?: Date;
    maxDate?: Date;
    allowFutureDates?: boolean;
}

export function DateInput({
    id,
    defaultValue = new Date(),
    onChange,
    disabled,
    minDate,
    maxDate,
    allowFutureDates = true // Explicitly allow future dates by default
}: DateInputProps) {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(
        new Date(defaultValue)
    )
    const [month, setMonth] = React.useState<Date | undefined>(date)
    const [value, setValue] = React.useState(formatDate(date))

    const handleDateChange = (newDate: Date | undefined, newValue: string) => {
        setDate(newDate)
        setValue(newValue)
        if (newDate) {
            setMonth(newDate)
        }

        // Call the onChange callback if provided
        if (onChange) {
            // Use timezone-safe date formatting to avoid day shifting
            if (newDate) {
                const year = newDate.getFullYear()
                const month = String(newDate.getMonth() + 1).padStart(2, '0')
                const day = String(newDate.getDate()).padStart(2, '0')
                onChange(`${year}-${month}-${day}`)
            } else {
                onChange('')
            }
        }
    }

    // Create a function to determine if a date should be disabled
    const isDateDisabled = (date: Date) => {
        // If future dates are not allowed and date is in the future
        if (!allowFutureDates && date > new Date()) {
            return true
        }

        // Check min/max date constraints
        if (minDate && date < minDate) {
            return true
        }

        if (maxDate && date > maxDate) {
            return true
        }

        return false
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="relative flex gap-2">
                <Input
                    id={id}
                    value={value}
                    className="bg-background pr-10"
                    disabled={disabled}
                    onChange={(e) => {
                        const date = new Date(e.target.value)
                        const inputValue = e.target.value
                        setValue(inputValue)

                        if (isValidDate(date)) {
                            handleDateChange(date, inputValue)
                        } else {
                            // Still call onChange even if date is invalid, in case parent needs to handle it
                            if (onChange) {
                                onChange(inputValue)
                            }
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                            e.preventDefault()
                            setOpen(true)
                        }
                    }}
                    readOnly
                />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="date-picker"
                            variant="ghost"
                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                            disabled={disabled}
                        >
                            <CalendarIcon className="size-3.5" />
                            <span className="sr-only">Select date</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                    >
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={(date) => {
                                const formattedValue = formatDate(date)
                                handleDateChange(date, formattedValue)
                                setOpen(false)
                            }}
                            disabled={isDateDisabled}
                            fromYear={1900}
                            toYear={2100}
                            defaultMonth={date || new Date()}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}
