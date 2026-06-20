import React, { forwardRef, useMemo } from 'react';
import ReactSelect, { type StylesConfig, type SelectInstance, type MultiValue, type SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';

type SelectOption = { label: string; value: string; options?: SelectOption[] };

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  children?: React.ReactNode;
  value?: string | string[] | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  searchable?: boolean;
  clearable?: boolean;
  multi?: boolean;
  async?: boolean;
  loadOptions?: (input: string) => Promise<{ label: string; value: string }[]>;
  placeholder?: string;
}

export const Select = forwardRef<SelectInstance<SelectOption, boolean>, SelectProps>(
  (
    {
      children,
      value,
      onChange,
      searchable = true,
      clearable = false,
      multi = false,
      async = false,
      loadOptions,
      placeholder,
      className,
      name,
      onBlur,
      disabled,
      ...rest
    },
    ref
  ) => {
    // Parse children to options
    const options = useMemo(() => {
      const opts: { label: string; value: string; options?: { label: string; value: string }[] }[] = [];
      React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) return;
        const props = child.props as React.ComponentProps<'option'>;
        if (child.type === 'option') {
          opts.push({
            label: props.children?.toString() || String(props.value ?? ''),
            value: String(props.value ?? ''),
          });
        } else if (child.type === 'optgroup') {
          const groupOpts: { label: string; value: string }[] = [];
          const optgroupProps = child.props as React.ComponentProps<'optgroup'>;
          React.Children.forEach(optgroupProps.children, (groupChild) => {
            if (React.isValidElement(groupChild) && groupChild.type === 'option') {
              const groupProps = groupChild.props as React.ComponentProps<'option'>;
              groupOpts.push({
                label: groupProps.children?.toString() || String(groupProps.value ?? ''),
                value: String(groupProps.value ?? ''),
              });
            }
          });
          opts.push({
            label: optgroupProps.label || '',
            value: optgroupProps.label || '',
            options: groupOpts,
          });
        }
      });
      return opts;
    }, [children]);

    // Map value
    const selectedOption = useMemo<SingleValue<SelectOption> | MultiValue<SelectOption>>(() => {
      const strValue = value?.toString();
      if (multi) {
        const values = Array.isArray(value) ? value.map(v => v.toString()) : strValue ? [strValue] : [];
        const allOpts = options.flatMap(o => o.options || [o]);
        return allOpts.filter(o => values.includes(o.value));
      } else {
        const allOpts = options.flatMap(o => o.options || [o]);
        return allOpts.find(o => o.value === strValue) ?? null;
      }
    }, [value, options, multi]);

    // Handle change
    const handleChange = (selected: SingleValue<SelectOption> | MultiValue<SelectOption>) => {
      if (!onChange) return;
      
      let newValue: string | string[] = '';
      if (multi) {
        newValue = Array.isArray(selected) ? selected.map((s) => s.value) : [];
      } else {
        const single = selected as SingleValue<SelectOption>;
        newValue = single ? single.value : '';
      }

      // Synthesize event for react-hook-form
      const event = {
        target: {
          name,
          value: newValue,
        },
      } as React.ChangeEvent<HTMLSelectElement>;
      
      onChange(event);
    };

    const commonProps = {
      options,
      value: selectedOption,
      onChange: handleChange,
      isSearchable: searchable,
      isClearable: clearable,
      isMulti: multi,
      placeholder,
      name,
      isDisabled: disabled,
      onBlur: () => onBlur?.({ target: { name } } as React.FocusEvent<HTMLSelectElement>),
      className: `react-select-container ${className || ''}`,
      classNamePrefix: 'react-select',
      styles: {
        control: (base, state) => ({
          ...base,
          minHeight: '40px',
          borderRadius: 'var(--radius-md, 8px)',
          borderColor: state.isFocused ? 'var(--primary, #10b981)' : 'var(--border, #e2e8f0)',
          boxShadow: state.isFocused ? '0 0 0 1px var(--primary, #10b981)' : 'none',
          '&:hover': {
            borderColor: state.isFocused ? 'var(--primary, #10b981)' : 'var(--border-hover, #cbd5e1)',
          },
          backgroundColor: 'var(--bg-input, #ffffff)',
        }),
        menu: (base) => ({
          ...base,
          borderRadius: 'var(--radius-md, 8px)',
          boxShadow: 'var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06))',
          zIndex: 50,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected 
            ? 'var(--primary, #10b981)' 
            : state.isFocused 
              ? 'var(--bg-hover, #f1f5f9)' 
              : 'transparent',
          color: state.isSelected ? '#ffffff' : 'var(--text-main, #0f172a)',
          '&:active': {
            backgroundColor: 'var(--primary-light, #d1fae5)',
          },
        }),
      } as StylesConfig<SelectOption>,
    };

    if (async) {
      return (
        <AsyncSelect<SelectOption, boolean>
          {...commonProps}
          loadOptions={loadOptions}
          ref={ref}
        />
      );
    }

    return (
      <ReactSelect<SelectOption, boolean>
        {...commonProps}
        ref={ref}
      />
    );
  }
);

Select.displayName = 'Select';
