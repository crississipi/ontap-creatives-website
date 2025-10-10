"use client";

import { countries } from '@/data/countries';
import { Country } from '@/types';
import React, { useState } from 'react'
import { TbCaretDownFilled } from 'react-icons/tb';

const ContactNum = () => {
  const [countryCodeOptions, showCountryCodeOptions] = useState(false);
  const [countryCode, selectedCountryCode] = useState<Country>(countries[136]);
  const [countrySearch, setCountrySearch] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const ValidateNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        let digits = e.target.value.replace(/\D/g, "");
      const countryDigits = countryCode.code.replace(/\D/g, "");
      if (digits.startsWith(countryDigits)) {
        digits = digits.slice(countryDigits.length);
      }

      if (countryCode.maxDigits) {
        if (digits.length > countryCode.maxDigits) {
          digits = digits.slice(0, countryCode.maxDigits);
        }
      }

      let formatted = digits;
      if (countryCode?.format) {
        try {
          formatted = countryCode.format(digits);
        } catch {
          formatted = digits;
        }
      }

      formatted = `${countryCode.code} ${formatted}`.trim();
      
      setContactNumber(formatted);
      e.target.value = formatted;
  }

  const searchCountry = countries.filter((c) => 
    c.country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <span className='px-5 pl-0 rounded-md border border-black/30 flex gap-3 text-sm'>
        <div className='relative flex gap-2 items-center'>
            <button 
                type="button"
                className='h-full w-full bg-light-blue/50 py-3 px-3 pr-2 flex items-center gap-1 rounded-l-sm group hover:bg-light-blue/70 focus:bg-light-blue ease-out duration-200'
                onClick={ () => showCountryCodeOptions(!countryCodeOptions) }
            >
                <span>{countryCode?.icon}</span>
                <span className='font-extrabold ml-2'>{countryCode?.code}</span>
                <TbCaretDownFilled className='text-neutral-400 group-hover:text-neutral-600 group-focus:text-black'/>
            </button>
            { countryCodeOptions && (
                <div className='absolute h-auto max-h-50 w-auto z-50 rounded-md bg-white top-full mt-1 overflow-x-hidden border border-black/20 shadow-md'>
                    <input 
                        type="text" 
                        className='sticky w-full min-w-42 top-0 p-2 bg-white border-b border-neutral-200 hover:border-b-2 hover:border-blue/50 focus:border-b-2 focus:border-blue outline-none ease-out duration-200'
                        value={countrySearch}
                        placeholder={countryCode?.icon + '  ' + countryCode?.country}
                        onChange={(e) => setCountrySearch(e.target.value)}
                    />
                    {searchCountry.map((value, i) => (
                        <button 
                            key={i} 
                            type="button" 
                            className='text-black p-2 w-full max-w-47 overflow-hidden flex items-center gap-3 justify-between hover:bg-light-blue/50 focus:bg-light-blue ease-out duration-200'
                            onClick={() => {
                                selectedCountryCode(value);
                                showCountryCodeOptions(false);
                                setCountrySearch("");
                            }}
                        >
                            <span>{value.icon}</span>
                            <span className='text-nowrap overflow-ellipsis overflow-hidden mr-auto'>{value.country}</span> 
                            <strong className='text-nowrap text-sm'>{value.code}</strong>
                        </button>
                    ))}
                </div>
            )}
        </div>
        <input 
            name='contact'
            type="tel"
            placeholder={countryCode?.placeholder}
            value={contactNumber}
            onChange={(e) => { ValidateNumber(e); }}
            className='h-full w-full outline-none'
        />
    </span>
  )
}

export default ContactNum