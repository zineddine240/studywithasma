import React from 'react';
import { useForm } from 'react-hook-form';
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem } from '@/components/ui/combobox';

export function TestCombobox() {
  const { register } = useForm();
  return (
    <Combobox {...register('test')}>
      <ComboboxInput />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxItem value="1">One</ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
