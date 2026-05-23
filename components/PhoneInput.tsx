'use client'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
}

export default function PhoneInput({ value, onChange }: PhoneInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Phone number to call <span className="text-red-500">*</span>
      </label>
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="+256700000000"
        required
        className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <p className="mt-1 text-xs text-gray-500">
        International format — e.g. +256700000000 or +254712345678
      </p>
    </div>
  )
}
