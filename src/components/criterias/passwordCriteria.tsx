export const passwordCriteria = [
    {
        label: "Mínimo de 8 caracteres",
        test: (v: string) => v.length >= 8,
    },
    {
        label: "Pelo menos 1 letra maiúscula",
        test: (v: string) => /[A-Z]/.test(v),
    },
    {
        label: "Pelo menos 1 letra minúscula",
        test: (v: string) => /[a-z]/.test(v),
    },
    {
        label: "Pelo menos 1 número",
        test: (v: string) => /\d/.test(v),
    },
    {
        label: "Pelo menos 1 caractere especial",
        test: (v: string) => /[!@#$%^&*(),.?":{}|<>_\-\\[\]=+;'/`~]/.test(v),
    },
];
