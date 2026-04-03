import React, { useState } from "react";
import { Plus, Trash2, Settings2, Type, Palette, Maximize, X, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PersonalizationManager = ({ fields, onUpdate }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newField, setNewField] = useState({
        type: "text",
        label: "",
        placeholder: "",
        maxLength: 20,
        required: true,
        options: [],
        sizeGuideUrl: "",
    });

    const [editingIndex, setEditingIndex] = useState(null);
    const [optTemp, setOptTemp] = useState({});
    const [addingOptTemp, setAddingOptTemp] = useState("");

    const addField = () => {
        if (!newField.label) return;
        onUpdate([...fields, { ...newField }]);
        resetNewField();
    };

    const resetNewField = () => {
        setNewField({
            type: "text",
            label: "",
            placeholder: "",
            maxLength: 20,
            required: true,
            options: [],
            sizeGuideUrl: "",
        });
        setIsAdding(false);
    };

    const removeField = (index) => {
        onUpdate(fields.filter((_, i) => i !== index));
    };

    const updateField = (index, updatedField) => {
        const newFields = [...fields];
        newFields[index] = updatedField;
        onUpdate(newFields);
    };

    const addOption = (index, option) => {
        if (!option) return;
        const field = fields[index];
        updateField(index, { ...field, options: [...(field.options || []), option] });
    };

    const removeOption = (fieldIndex, optionIndex) => {
        const field = fields[fieldIndex];
        updateField(fieldIndex, { ...field, options: field.options.filter((_, i) => i !== optionIndex) });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Settings2 size={16} className="text-orange-500" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">Personalization Setup</h3>
                </div>
                <button
                    type="button"
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-500 text-[10px] font-bold uppercase tracking-wider hover:bg-orange-500/20 transition-all"
                >
                    <Plus size={14} />
                    Add Field
                </button>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {fields.map((field, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0B0F19] border border-white/10 rounded-xl p-4 relative group"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${field.type === 'text' ? 'bg-blue-500/10 text-blue-400' :
                                        field.type === 'color' ? 'bg-purple-500/10 text-purple-400' :
                                            'bg-emerald-500/10 text-emerald-400'
                                        }`}>
                                        {field.type === 'text' && <Type size={16} />}
                                        {field.type === 'color' && <Palette size={16} />}
                                        {field.type === 'size' && <Maximize size={16} />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-0.5">{field.label}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                            {field.type} {field.required ? '• Required' : '• Optional'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeField(index)}
                                    className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            {/* Field details / Options */}
                            <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                                {field.type === 'text' && (
                                    <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-400 font-medium tracking-tight">
                                        <div>Placeholder: <span className="text-slate-300">{field.placeholder || 'None'}</span></div>
                                        <div>Max Length: <span className="text-slate-300">{field.maxLength || 'None'}</span></div>
                                    </div>
                                )}

                                {(field.type === 'color' || field.type === 'size') && (
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Options</label>
                                        <div className="flex flex-wrap gap-2">
                                            {field.options?.map((opt, optIdx) => (
                                                <div key={optIdx} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-white font-medium">
                                                    {field.type === 'color' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: opt }} />}
                                                    {opt}
                                                    <button onClick={() => removeOption(index, optIdx)} className="text-slate-500 hover:text-white">
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="flex items-center gap-2">
                                                {field.type === 'color' && (
                                                    <input
                                                        type="color"
                                                        value={optTemp[index] || "#000000"}
                                                        className="w-8 h-8 p-0.5 bg-[#0B0F19] border border-white/10 rounded-lg cursor-pointer"
                                                        onChange={(e) => setOptTemp({ ...optTemp, [index]: e.target.value })}
                                                    />
                                                )}
                                                <input
                                                    type="text"
                                                    placeholder={field.type === 'color' ? "#HEX" : "Add option..."}
                                                    value={optTemp[index] || ""}
                                                    className={`bg-white/5 border border-white/10 rounded-md px-2 py-1 text-[10px] text-white outline-none focus:border-orange-500/50 ${field.type === 'color' ? 'w-20' : 'w-24'}`}
                                                    onChange={(e) => setOptTemp({ ...optTemp, [index]: e.target.value })}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addOption(index, e.target.value);
                                                            setOptTemp({ ...optTemp, [index]: '' });
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        addOption(index, optTemp[index]);
                                                        setOptTemp({ ...optTemp, [index]: '' });
                                                    }}
                                                    className="p-1 text-orange-500 hover:bg-orange-500/10 rounded-md transition-all"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {field.type === 'size' && (
                                    <div className="text-[10px] text-slate-400">
                                        Size Guide URL: <span className="text-slate-300">{field.sizeGuideUrl || 'Default'}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1a1f2e] border border-orange-500/30 rounded-xl p-5 shadow-2xl space-y-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</label>
                                <select
                                    value={newField.type}
                                    onChange={(e) => setNewField({ ...newField, type: e.target.value, options: [] })}
                                    className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                                >
                                    <option value="text">Text Input</option>
                                    <option value="color">Color Section</option>
                                    <option value="size">Size Section</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Label</label>
                                <input
                                    type="text"
                                    value={newField.label}
                                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                                    placeholder="e.g. Back Name"
                                    className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                                />
                            </div>
                        </div>

                        {newField.type === "text" && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Placeholder</label>
                                    <input
                                        type="text"
                                        value={newField.placeholder}
                                        onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                                        className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max Length</label>
                                    <input
                                        type="number"
                                        value={newField.maxLength}
                                        onChange={(e) => setNewField({ ...newField, maxLength: parseInt(e.target.value) })}
                                        className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                                    />
                                </div>
                            </div>
                        )}

                        {(newField.type === "color" || newField.type === "size") && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Initial Options</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {newField.options.map((opt, i) => (
                                        <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-white">
                                            {newField.type === 'color' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: opt }} />}
                                            {opt}
                                            <button
                                                type="button"
                                                onClick={() => setNewField({ ...newField, options: newField.options.filter((_, idx) => idx !== i) })}
                                                className="text-slate-500 hover:text-white"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    {newField.type === 'color' && (
                                        <input
                                            type="color"
                                            value={addingOptTemp || "#000000"}
                                            className="w-10 h-10 p-1 bg-[#0B0F19] border border-white/10 rounded-lg cursor-pointer"
                                            onChange={(e) => setAddingOptTemp(e.target.value)}
                                        />
                                    )}
                                    <input
                                        type="text"
                                        placeholder={newField.type === 'color' ? "#HEX" : "Add option..."}
                                        value={addingOptTemp || ""}
                                        className={`bg-[#0B0F19] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-orange-500/50 ${newField.type === 'color' ? 'w-24' : 'flex-1'}`}
                                        onChange={(e) => setAddingOptTemp(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = addingOptTemp.trim();
                                                if (val && !newField.options.includes(val)) {
                                                    setNewField({ ...newField, options: [...newField.options, val] });
                                                    setAddingOptTemp("");
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const val = addingOptTemp.trim();
                                            if (val && !newField.options.includes(val)) {
                                                setNewField({ ...newField, options: [...newField.options, val] });
                                                setAddingOptTemp("");
                                            }
                                        }}
                                        className="p-2 bg-orange-500/10 text-orange-500 rounded-lg border border-orange-500/20 hover:bg-orange-500/20 transition-all"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                {newField.type === 'color' && (
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Type hex or click to pick</p>
                                )}
                            </div>
                        )}

                        {newField.type === "size" && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Size Guide URL</label>
                                <input
                                    type="text"
                                    value={newField.sizeGuideUrl}
                                    onChange={(e) => setNewField({ ...newField, sizeGuideUrl: e.target.value })}
                                    placeholder="/size-guide"
                                    className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={addField}
                                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 rounded-lg text-xs uppercase tracking-wider transition-all"
                            >
                                Add Field
                            </button>
                            <button
                                type="button"
                                onClick={resetNewField}
                                className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-xs font-bold uppercase transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {!isAdding && fields.length === 0 && (
                <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-10 text-center">
                    <Settings2 size={24} className="text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">No personalization fields yet</p>
                </div>
            )}
        </div>
    );
};

export default PersonalizationManager;
