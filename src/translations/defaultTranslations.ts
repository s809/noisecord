export default {
    "locale_string": "en-US",
    "set_locale_regex": "en(g(lish)?)?",
    "boolean_values": [
        ["no", "n", "false"],
        ["yes", "y", "true"]
    ],
    "command_processor": {
        "strings": {
            "command_usage": "Command usage: `{usage}`",
            "argument_name": "argument: \"{name}\"",
            "done": "Done!"
        },
        "errors": {
            "unknown_command": "Unknown command.",
            "too_few_arguments": "Too few arguments.",
            "too_many_arguments": "Too many arguments.",
            "value_not_allowed": "{arg} is not one of allowed values. (Allowed values: {allowedValues})",
            "invalid_numeric": "{arg} is not a valid number.",
            "value_too_small": "Value of {arg} is too small. (Min: {minValue})",
            "value_too_large": "Value of {arg} is too large. (Max: {maxValue})",
            "invalid_channel": "{arg} is not a valid channel.",
            "value_too_short": "Value of {arg} is too short. (Min: {minLength})",
            "value_too_long": "Value of {arg} is too long. (Max: {maxLength})",
            "channel_constraints_not_met": "{arg} does not meet channel type constraint.",
            "unsupported_argument_type": "{arg} has unsupported argument type. This error must never happen."
        }
    }
};