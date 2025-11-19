export default function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0].replace(/-/g, "/");
}