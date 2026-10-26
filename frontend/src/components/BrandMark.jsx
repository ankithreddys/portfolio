import './BrandMark.css'

function BrandMark({ className = '' }) {
  return (
    <svg
      className={`brand-mark ${className}`.trim()}
      viewBox="0 0 112 60"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <text className="brand-mark-letter" x="3" y="43">A</text>
      <text className="brand-mark-letter" x="39" y="43">R</text>
      <text className="brand-mark-letter brand-mark-letter-last" x="76" y="43">S</text>
      <path className="brand-mark-thread" d="M12 53 Q56 46 100 53" />
      <circle className="brand-mark-node" cx="12" cy="53" r="2" />
      <circle className="brand-mark-node brand-mark-node-focus" cx="56" cy="49.5" r="3" />
      <circle className="brand-mark-node" cx="100" cy="53" r="2" />
    </svg>
  )
}

export default BrandMark
