import React from "react";
function PortfolioButton({
  text,
  icon: Icon,
  href,
  onClick,
  target,
  className,
  iconClassName,
  type,
  sx,
  disabled,
}) {
  return (
    <>
      {href ? (
        <a href={href} target={target} className={`${className}`} style={sx}>
          {text && (
            <span className={`text-center w-90% mob:w-10/12`}>{text}</span>
          )}
          {Icon && (
            <div className="h-full w-10 rounded-full flex items-center justify-center border border-solid border-pfp-yellow bg-bgpfp-yellow">
              <Icon className={`${iconClassName}`} />
            </div>
          )}
        </a>
      ) : (
        <button
          type={type || "button"}
          onClick={onClick}
          className={`${className}`}
          style={sx}
          disabled = {disabled}
        >
          {text && (
            <span className="text-center w-90% mob:w-10/12">{text}</span>
          )}
          {Icon && (
            <div className="h-full w-11 rounded-full flex items-center justify-center border border-solid border-pfp-yellow bg-bgpfp-yellow">
              <Icon className={`${iconClassName}`} />
            </div>
          )}
        </button>
      )}
    </>
  );
}

export default PortfolioButton;
