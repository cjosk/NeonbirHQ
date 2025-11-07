export function severityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case "critical":
      return "text-red-400";
    case "high":
      return "text-orange-400";
    case "medium":
      return "text-yellow-400";
    default:
      return "text-slate-400";
  }
}
