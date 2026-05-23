'use client'

import { useState } from 'react'
import { TemplateField } from '@/config/agents'

interface VariableFormProps {
  fields: TemplateField[]
  values: Record<string, string>
  onChange: (values: Record<string, string>) => void
}

export default function VariableForm({ fields, values, onChange }: VariableFormProps) {
  function handleChange(key: string, value: string) {
    onChange({ ...values, [key]: value })
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.type === 'select' && field.options ? (
            <select
              value={values[field.key] ?? ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              required={field.required}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="" disabled>
                {field.placeholder}
              </option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type === 'number' ? 'number' : 'text'}
              value={values[field.key] ?? ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          )}
        </div>
      ))}
    </div>
  )
}
