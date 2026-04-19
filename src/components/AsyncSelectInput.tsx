import { Control, Controller } from 'react-hook-form';
import Select, { Props as SelectProps } from 'react-select';

export interface AsyncSelectOption {
  id: string | number;
  value: string | number;
  label: string;
  [key: string]: any;
}

interface AsyncSelectInputProps extends Omit<SelectProps<AsyncSelectOption>, 'onChange'> {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  options: AsyncSelectOption[];
  onMenuScrollToBottom: () => void;
  isLoading?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  rules?: any;
  onChange?: (option: AsyncSelectOption | null) => void;
  error?: string;
}

export const AsyncSelectInput = ({
  name,
  control,
  label,
  placeholder = "Select...",
  options,
  onMenuScrollToBottom,
  isLoading,
  isRequired,
  isReadOnly,
  rules,
  onChange: customOnChange,
  error,
  ...props
}: AsyncSelectInputProps) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-black dark:text-gray-300">
        {label} {isRequired && <span className="text-red-500">*</span>}
        {isReadOnly && <span className="text-xs text-gray-500 ml-2">(Read Only)</span>}
      </label>
      
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => {
          const selectedValue = options.find(opt => opt.value === value) || null;
          
          return (
            <div className="relative">
              <Select
                {...props}
                isDisabled={isReadOnly || props.isDisabled}
                isLoading={isLoading}
                placeholder={placeholder}
                options={options}
                value={selectedValue}
                onMenuScrollToBottom={onMenuScrollToBottom}
                onChange={(option) => {
                  const val = option ? (option as AsyncSelectOption).value : "";
                  onChange(val);
                  if (customOnChange) customOnChange(option as AsyncSelectOption | null);
                }}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: 'transparent',
                    borderColor: fieldError || error ? '#ef4444' : (state.isFocused ? '#000000' : '#e5e7eb'),
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: state.isFocused ? '#000000' : '#d1d5db',
                    },
                    borderRadius: '0px',
                    minHeight: '40px',
                    cursor: isReadOnly ? 'not-allowed' : 'pointer',
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: 'white',
                    zIndex: 100,
                    borderRadius: '0px',
                    border: '1px solid #e5e7eb',
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected ? '#000000' : (state.isFocused ? '#f3f4f6' : 'transparent'),
                    color: state.isSelected ? '#ffffff' : '#000000',
                    cursor: 'pointer',
                    '&:active': {
                      backgroundColor: '#000000',
                      color: '#ffffff',
                    },
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: '#9ca3af',
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: 'inherit',
                  }),
                }}
              />
              {(fieldError || error) && (
                <span className="text-xs text-red-500 mt-1">
                  {fieldError?.message || error}
                </span>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};
