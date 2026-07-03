import React, { forwardRef, useMemo, useRef, useEffect, useState } from 'react';
import ReactSelect, { type StylesConfig, type MultiValue, type SingleValue } from 'react-select';
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

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
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
    externalRef
  ) => {
    const internalRef = useRef<HTMLSelectElement>(null);

    const isControlled = value !== undefined;
    const [displayValue, setDisplayValue] = useState<string | string[]>(
      Array.isArray(value) ? value.map(String) : value !== undefined ? value.toString() : ''
    );

    const setRefs = (element: HTMLSelectElement | null) => {
      internalRef.current = element;
      if (typeof externalRef === 'function') {
        externalRef(element);
      } else if (externalRef) {
        (externalRef as React.MutableRefObject<HTMLSelectElement | null>).current = element;
      }
    };

    const options = useMemo(() => {
      const opts: SelectOption[] = [];
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
          opts.push({ label: optgroupProps.label || '', value: optgroupProps.label || '', options: groupOpts });
        }
      });
      return opts;
    }, [children]);

    useEffect(() => {
      if (!isControlled && internalRef.current) {
        const hv = multi
          ? Array.from(internalRef.current.selectedOptions).map((o) => o.value)
          : internalRef.current.value;
        setDisplayValue((prev) => (JSON.stringify(prev) !== JSON.stringify(hv) ? hv : prev));
      }
    }, [isControlled, multi, options]);

    const activeValue = isControlled ? value : displayValue;

    const selectedOption = useMemo<SingleValue<SelectOption> | MultiValue<SelectOption>>(() => {
      const strValue = activeValue?.toString();
      const allOpts = options.flatMap((o) => o.options || [o]);
      if (multi) {
        const vals = Array.isArray(activeValue) ? activeValue.map((v) => v.toString()) : strValue ? [strValue] : [];
        return allOpts.filter((o) => vals.includes(o.value));
      }
      return allOpts.find((o) => o.value === strValue) ?? null;
    }, [activeValue, options, multi]);

    const handleSelectChange = (selected: SingleValue<SelectOption> | MultiValue<SelectOption>) => {
      const newValue = multi
        ? Array.isArray(selected) ? selected.map((s) => s.value) : []
        : (() => { const single = selected as SingleValue<SelectOption>; return single ? single.value : ''; })();

      const selectElement = internalRef.current;
      if (selectElement) {
        if (multi && Array.isArray(newValue)) {
          Array.from(selectElement.options).forEach((opt) => {
            opt.selected = (newValue as string[]).includes(opt.value);
          });
        } else {
          selectElement.value = newValue as string;
        }
        if (onChange) {
          const target = { name: selectElement.name, value: newValue };
          onChange({ type: 'change', target, currentTarget: target } as React.ChangeEvent<HTMLSelectElement>);
        } else {
          selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      if (!isControlled) setDisplayValue(newValue);
    };

    const handleReactSelectBlur = () => {
      if (!onBlur) return;
      window.setTimeout(() => {
        const selectElement = internalRef.current;
        if (!selectElement) return;
        const target = {
          name: selectElement.name,
          value: multi ? Array.from(selectElement.selectedOptions).map((option) => option.value) : selectElement.value,
        };
        onBlur({ type: 'blur', target, currentTarget: target } as React.FocusEvent<HTMLSelectElement>);
      }, 0);
    };

    const styles: StylesConfig<SelectOption> = {
      control: (base, state) => ({
        ...base,
        minHeight: '40px',
        borderRadius: 'var(--radius-md, 8px)',
        borderColor: state.isFocused ? 'var(--primary, #17181a)' : 'var(--border, #e5e5e3)',
        boxShadow: state.isFocused ? '0 0 0 1px var(--primary, #17181a)' : 'none',
        '&:hover': { borderColor: state.isFocused ? 'var(--primary, #17181a)' : 'var(--border-hover, #d6d6d4)' },
        backgroundColor: 'var(--bg-input, #ffffff)',
      }),
      menu: (base) => ({
        ...base,
        borderRadius: 'var(--radius-md, 8px)',
        boxShadow: 'var(--shadow-md, 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06))',
        zIndex: 50,
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? 'var(--primary, #17181a)' : state.isFocused ? 'var(--bg-hover, #f1f1ef)' : 'transparent',
        color: state.isSelected ? '#ffffff' : 'var(--text-main, #17181a)',
        '&:active': { backgroundColor: 'var(--primary-light, #ececea)' },
      }),
    };

    const commonProps = {
      options,
      value: selectedOption,
      onChange: handleSelectChange,
      isSearchable: searchable,
      isClearable: clearable,
      isMulti: multi,
      blurInputOnSelect: true,
      placeholder,
      name,
      isDisabled: disabled,
      onBlur: handleReactSelectBlur,
      className: `react-select-container ${className || ''}`,
      classNamePrefix: 'react-select',
      styles,
    };

    return (
      <>
        <select
          ref={setRefs}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          multiple={multi}
          defaultValue={isControlled ? undefined : (value as string | undefined)}
          style={{ display: 'none' }}
          aria-hidden="true"
          tabIndex={-1}
          {...rest}
        >
          {children}
        </select>
        {async ? (
          <AsyncSelect<SelectOption, boolean> {...commonProps} loadOptions={loadOptions} />
        ) : (
          <ReactSelect<SelectOption, boolean> {...commonProps} />
        )}
      </>
    );
  }
);

Select.displayName = 'Select';
