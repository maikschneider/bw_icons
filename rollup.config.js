import typescript from '@rollup/plugin-typescript';

export default {
    input: [
        'Resources/Private/TypeScript/IconSelection.ts',
        'Resources/Private/TypeScript/IconPicker.ts',
    ],
    output: [
        {
            dir: 'Resources/Public/JavaScript',
            format: 'es'
        }
    ],
    plugins: [
        typescript()
    ],
}
