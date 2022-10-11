// ** Icons Import
import { Heart } from "react-feather"

const Footer = () => {
  return (
    <p className="clearfix mb-0">
      <span className="float-md-start d-block d-md-inline-block mt-25">
        Copyright © {new Date().getFullYear()}{" "}
        <a href="https://uaufi.com" target="_blank" rel="noopener noreferrer">
          Uau-Fi Connect
        </a>
        <span className="d-none d-sm-inline-block">
          , todos os direitos reservados
        </span>
      </span>
      <span className="float-md-end d-none d-md-block"></span>
    </p>
  )
}

export default Footer
