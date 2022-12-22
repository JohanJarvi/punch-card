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
  active: boolean;
}

export const Button = (props: ButtonProps) => {
  const [active, setActive] = useState(props.active);

  useEffect(() => {
    setActive(props.active);
  }, [props]);

  return (
    <button
      className={"button " + (active ? "active" : "inactive")}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
