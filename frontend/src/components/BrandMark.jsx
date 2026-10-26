import './BrandMark.css'

function BrandMark({ expanded = false }) {
  return (
    <span
      className={`brand-mark${expanded ? ' brand-mark-expanded' : ''}`}
      role={expanded ? 'math' : undefined}
      aria-label={expanded ? 'Attention of R and S equals softmax of R S transpose divided by the square root of d, multiplied by S' : undefined}
      aria-hidden={expanded ? undefined : 'true'}
    >
      <span className="brand-mark-name">
        <span className="brand-mark-a">A</span>
        <span className="brand-mark-punctuation">(</span>
        <span className="brand-mark-symbol">R</span>
        <span className="brand-mark-comma">,</span>
        <span className="brand-mark-symbol">S</span>
        <span className="brand-mark-punctuation">)</span>
      </span>
      {expanded && (
        <span className="brand-mark-definition" aria-hidden="true">
          <span className="brand-mark-equals">=</span>
          <span className="brand-mark-operator">softmax</span>
          <span className="brand-mark-punctuation">(</span>
          <span className="brand-mark-fraction">
            <span className="brand-mark-numerator"><i>R</i><i>S</i><sup>⊤</sup></span>
            <span className="brand-mark-denominator">√<i>d</i></span>
          </span>
          <span className="brand-mark-punctuation">)</span>
          <span className="brand-mark-value">S</span>
        </span>
      )}
    </span>
  )
}

export default BrandMark
