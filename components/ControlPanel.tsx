'use client';

import { MakeupSettings } from '@/lib/makeupRenderer';

interface ControlPanelProps {
    makeupSettings: MakeupSettings;
    onSettingsChange: (settings: MakeupSettings) => void;
}

export default function ControlPanel({ makeupSettings, onSettingsChange }: ControlPanelProps) {
    const updateSetting = (
        category: 'lipstick' | 'blush' | 'eyeshadow',
        key: 'enabled' | 'color' | 'opacity',
        value: boolean | string | number
    ) => {
        onSettingsChange({
            ...makeupSettings,
            [category]: {
                ...makeupSettings[category],
                [key]: value,
            },
        });
    };

    const resetAll = () => {
        onSettingsChange({
            lipstick: { enabled: true, color: '#D4869C', opacity: 0.7 },
            blush: { enabled: false, color: '#F5A9B8', opacity: 0.5 },
            eyeshadow: { enabled: false, color: '#CD7F32', opacity: 0.6 },
        });
    };

    return (
        <div className="glass-strong p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold gradient-text">Makeup Controls</h2>
                <button
                    onClick={resetAll}
                    className="px-4 py-2 text-sm glass hover:bg-white/10 rounded-lg transition-all"
                >
                    Reset All
                </button>
            </div>

            {/* Lipstick Controls */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={makeupSettings.lipstick.enabled}
                            onChange={(e) => updateSetting('lipstick', 'enabled', e.target.checked)}
                            className="w-5 h-5 accent-purple-500"
                        />
                        <span className="font-semibold text-lg">Lipstick</span>
                    </label>
                    <div className="flex items-center gap-3">
                        <code className="text-xs text-gray-400 font-mono">{makeupSettings.lipstick.color.toUpperCase()}</code>
                        <input
                            type="color"
                            value={makeupSettings.lipstick.color}
                            onChange={(e) => updateSetting('lipstick', 'color', e.target.value)}
                            disabled={!makeupSettings.lipstick.enabled}
                            className="cursor-pointer disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Opacity</span>
                        <span className="text-purple-400">{Math.round(makeupSettings.lipstick.opacity * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={makeupSettings.lipstick.opacity}
                        onChange={(e) => updateSetting('lipstick', 'opacity', parseFloat(e.target.value))}
                        disabled={!makeupSettings.lipstick.enabled}
                        className="disabled:opacity-50"
                    />
                </div>
            </div>

            <div className="border-t border-white/10"></div>

            {/* Blush Controls */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={makeupSettings.blush.enabled}
                            onChange={(e) => updateSetting('blush', 'enabled', e.target.checked)}
                            className="w-5 h-5 accent-purple-500"
                        />
                        <span className="font-semibold text-lg">Blush</span>
                    </label>
                    <div className="flex items-center gap-3">
                        <code className="text-xs text-gray-400 font-mono">{makeupSettings.blush.color.toUpperCase()}</code>
                        <input
                            type="color"
                            value={makeupSettings.blush.color}
                            onChange={(e) => updateSetting('blush', 'color', e.target.value)}
                            disabled={!makeupSettings.blush.enabled}
                            className="cursor-pointer disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Opacity</span>
                        <span className="text-purple-400">{Math.round(makeupSettings.blush.opacity * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={makeupSettings.blush.opacity}
                        onChange={(e) => updateSetting('blush', 'opacity', parseFloat(e.target.value))}
                        disabled={!makeupSettings.blush.enabled}
                        className="disabled:opacity-50"
                    />
                </div>
            </div>

            <div className="border-t border-white/10"></div>

            {/* Eyeshadow Controls */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={makeupSettings.eyeshadow.enabled}
                            onChange={(e) => updateSetting('eyeshadow', 'enabled', e.target.checked)}
                            className="w-5 h-5 accent-purple-500"
                        />
                        <span className="font-semibold text-lg">Eyeshadow</span>
                    </label>
                    <div className="flex items-center gap-3">
                        <code className="text-xs text-gray-400 font-mono">{makeupSettings.eyeshadow.color.toUpperCase()}</code>
                        <input
                            type="color"
                            value={makeupSettings.eyeshadow.color}
                            onChange={(e) => updateSetting('eyeshadow', 'color', e.target.value)}
                            disabled={!makeupSettings.eyeshadow.enabled}
                            className="cursor-pointer disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Opacity</span>
                        <span className="text-purple-400">{Math.round(makeupSettings.eyeshadow.opacity * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={makeupSettings.eyeshadow.opacity}
                        onChange={(e) => updateSetting('eyeshadow', 'opacity', parseFloat(e.target.value))}
                        disabled={!makeupSettings.eyeshadow.enabled}
                        className="disabled:opacity-50"
                    />
                </div>
            </div>
        </div>
    );
}
