export default function GradualBlur({ visible = true, className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`gradual-blur ${visible ? 'gradual-blur--visible' : ''} ${className}`}
    >
      <div className="gradual-blur__layer gradual-blur__layer--1" />
      <div className="gradual-blur__layer gradual-blur__layer--2" />
      <div className="gradual-blur__layer gradual-blur__layer--3" />
      <div className="gradual-blur__layer gradual-blur__layer--4" />
      <div className="gradual-blur__layer gradual-blur__layer--5" />
    </div>
  )
}
