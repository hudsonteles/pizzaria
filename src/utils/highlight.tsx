
export function highlight(text: string, search: string) {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.split(regex).map((part, i) =>
        regex.test(part) ? (
            <mark key={i} style={{ background: "#ffe066", padding: 0 }}>{part}</mark>
        ) : (
            part
        )
    );
}
