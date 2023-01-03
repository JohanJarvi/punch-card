import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useEffect,
  useState,
} from "react";
import "./Button.css";

export interface ButtonProps
  extends DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    React.AriaAttributes {
  active?: boolean;
  label?: string;
}

export const Button = (props: ButtonProps) => {
  const [active, setActive] = useState(props.active);

  useEffect(() => {
    setActive(props.active);
  }, [props]);

  const getConditionalButtonClass = (active: boolean | undefined): string => {
    if (active === undefined) return "";

    return active ? "active" : "inactive";
  };

  return (
    <button
      className={"button " + getConditionalButtonClass(active)}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
};
