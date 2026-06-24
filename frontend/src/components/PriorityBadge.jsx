/**
 * PriorityBadge — displays a colored badge for a todo's priority level.
 * @param {{ priority: 'low' | 'medium' | 'high' }} props
 */
export default function PriorityBadge({ priority }) {
  const config = {
    high:   { label: 'High',   className: 'badge badge-high' },
    medium: { label: 'Medium', className: 'badge badge-medium' },
    low:    { label: 'Low',    className: 'badge badge-low' },
  };

  const { label, className } = config[priority] || config.medium;

  return <span className={className}>{label}</span>;
}
