const presets = [
    [
        "@babel/env",
        {
            targets: {
                edge: "17",
                firefox: "60",
                chrome: "64",
                safari: "11.1",
            },
            useBuiltIns: "usage",
            corejs: "3.0.0",
                "targets": {
                    "esmodules": true,
                    "ie": "11"
                }
        },
    ],
];

const plugins = [
    "@babel/plugin-proposal-class-properties"
]

module.exports = { presets, plugins };