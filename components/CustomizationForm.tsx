import React from "react";
import clsx from "clsx";

interface Field {
  key: string;
  label: string;
  type: "text" | "name-number" | "number" | "select" | "boolean";
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  options?: string[];
  helperText?: string;
}

interface Props {
  fields: Field[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

const CustomizationForm: React.FC<Props> = ({ fields, values, onChange }) => {
  const getValue = (key: string) => values[key] ?? "";

  const handleChange = (key: string, value: any) => {
    onChange(key, value);
  };

  return (
    <div className="space-y-6">
      {fields.map((field) => {
        const currentValue = getValue(field.key);
        const isNameNumber = field.type === "name-number";
        const isText = field.type === "text";
        const isNumber = field.type === "number";

        return (
          <div key={field?.key ?? 0} className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                {/* {field.label}  */}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {/* Name + Number Special Field */}
              {isNameNumber && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Player Name */}
                  <div>
                    <input
                      type="text"
                      placeholder={field.placeholder || "e.g. MESSI"}
                      maxLength={12}
                      value={currentValue.name || ""}
                      onChange={(e) =>
                        handleChange(field.key, {
                          ...currentValue,
                          name: e.target.value.toUpperCase(),
                        })
                      }
                      className={clsx(
                        "w-full px-4 py-3 rounded-xl border-2 text-lg font-bold tracking-wider",
                        "focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500",
                        "transition-all duration-200 uppercase placeholder:lowercase",
                        currentValue.name
                          ? "border-gray-300"
                          : "border-gray-200 bg-gray-50"
                      )}
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>Name</span>
                      <span>
                        {currentValue.name?.length || 0}/{12}
                      </span>
                    </div>
                  </div>

                  {/* Player Number */}
                  <div>
                    <input
                      type="number"
                      placeholder="10"
                      min="0"
                      max="99"
                      value={currentValue.number || ""}
                      onChange={(e) => {
                        const num = e.target.value;
                        if (
                          num === "" ||
                          (Number(num) >= 0 && Number(num) <= 99)
                        ) {
                          handleChange(field.key, {
                            ...currentValue,
                            number: num,
                          });
                        }
                      }}
                      className={clsx(
                        "w-full px-4 py-3 rounded-xl border-2 text-lg font-bold text-center",
                        "focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500",
                        "transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                        currentValue.number
                          ? "border-gray-300"
                          : "border-gray-200 bg-gray-50"
                      )}
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>Number</span>
                      <span>
                        {currentValue.number?.length || 0}-{99}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isText && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Player Name */}
                  <div>
                    <input
                      type="text"
                      placeholder={field.placeholder || "e.g. MESSI"}
                      maxLength={12}
                      value={currentValue.name || ""}
                      onChange={(e) =>
                        handleChange(field.key, {
                          ...currentValue,
                          name: e.target.value.toUpperCase(),
                        })
                      }
                      className={clsx(
                        "w-full px-4 py-3 rounded-xl border-2 text-lg font-bold tracking-wider",
                        "focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500",
                        "transition-all duration-200 uppercase placeholder:lowercase",
                        currentValue.name
                          ? "border-gray-300"
                          : "border-gray-200 bg-gray-50"
                      )}
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>Name</span>
                      <span>
                        {currentValue.name?.length || 0}/{12}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isNumber && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Player Number */}
                  <div>
                    <input
                      type="number"
                      placeholder="10"
                      min="0"
                      max="99"
                      value={currentValue.number || ""}
                      onChange={(e) => {
                        const num = e.target.value;
                        if (
                          num === "" ||
                          (Number(num) >= 0 && Number(num) <= 99)
                        ) {
                          handleChange(field.key, {
                            ...currentValue,
                            number: num,
                          });
                        }
                      }}
                      className={clsx(
                        "w-full px-4 py-3 rounded-xl border-2 text-lg font-bold text-center",
                        "focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500",
                        "transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                        currentValue.number
                          ? "border-gray-300"
                          : "border-gray-200 bg-gray-50"
                      )}
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>Number</span>
                      <span>
                        {currentValue.number?.length || 0}-{99}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomizationForm;
