import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Command as CommandPrimitive } from "cmdk"

export function Combobox({ options, value, onValueChange, placeholder = "Selecione uma opção...", emptyText = "Nenhum item encontrado." }) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          aria-expanded={open}
          className="flex min-h-12 w-full items-center justify-between rounded-2xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-700 outline-none transition-colors hover:bg-gray-50 focus:border-[#1A2C71]"
        >
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={8}
          className="z-50 w-[var(--radix-popover-trigger-width)] min-w-[200px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 text-slate-950 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          <CommandPrimitive className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-white text-slate-950">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandPrimitive.Input
                placeholder="Pesquisar..."
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <CommandPrimitive.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
              <CommandPrimitive.Empty className="py-6 text-center text-sm text-slate-500">
                {emptyText}
              </CommandPrimitive.Empty>
              <CommandPrimitive.Group>
                {options.map((option) => (
                  <CommandPrimitive.Item
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onValueChange(option.value === value ? "" : option.value)
                      setOpen(false)
                    }}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none data-[selected='true']:bg-slate-100 data-[selected='true']:text-slate-900 cursor-pointer hover:bg-slate-100"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === option.value ? "opacity-100 text-[#1A2C71]" : "opacity-0"
                      }`}
                    />
                    {option.label}
                  </CommandPrimitive.Item>
                ))}
              </CommandPrimitive.Group>
            </CommandPrimitive.List>
          </CommandPrimitive>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
