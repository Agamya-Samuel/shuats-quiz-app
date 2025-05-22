// ComboboxField.tsx
'use client';

import * as React from 'react';
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '@/components/ui/popover';
import {
	Command,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Option type for the combobox
export interface ComboboxOption {
	value: string;
	label: string;
}

// Props for the ComboboxField
interface ComboboxFieldProps {
	label: string;
	placeholder: string;
	options: ComboboxOption[];
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

/**
 * Reusable ComboboxField component using shadcn/ui Combobox pattern.
 * Provides a searchable dropdown for long lists (e.g., country, state, city).
 *
 * Props:
 * - label: Field label
 * - placeholder: Placeholder text
 * - options: Array of { value, label }
 * - value: Current selected value
 * - onChange: Callback when value changes
 * - disabled: Disable the field
 */
export function ComboboxField({
	label,
	placeholder,
	options,
	value,
	onChange,
	disabled,
}: ComboboxFieldProps) {
	const [open, setOpen] = React.useState(false);
	const selected = options.find((opt) => opt.value === value);

	return (
		<div className="w-full space-y-2">
			<label className="block mb-1 text-sm font-medium">{label}</label>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between"
						disabled={disabled}
						type="button"
					>
						{selected ? selected.label : placeholder}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0">
					<Command>
						<CommandInput
							placeholder={`Search ${label.toLowerCase()}...`}
						/>
						<CommandList>
							<CommandEmpty>
								No {label.toLowerCase()} found.
							</CommandEmpty>
							<CommandGroup>
								{options.map((option) => (
									<CommandItem
										key={option.value}
										value={option.value}
										onSelect={(currentValue) => {
											onChange(currentValue);
											setOpen(false);
										}}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												value === option.value
													? 'opacity-100'
													: 'opacity-0'
											)}
										/>
										{option.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
