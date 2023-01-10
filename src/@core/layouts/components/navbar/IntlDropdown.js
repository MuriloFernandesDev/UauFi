// ** Third Party Components
import { useTranslation } from "react-i18next"
import ReactCountryFlag from "react-country-flag"

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap"

const IntlDropdown = () => {
  // ** Hooks
  const { i18n } = useTranslation()

  // ** Function to switch Language
  const handleLangUpdate = (e, lang) => {
    e.preventDefault()
    i18n.changeLanguage(lang)
  }

  return (
    <UncontrolledDropdown
      href="/"
      tag="li"
      className="dropdown-language nav-item"
    >
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link"
        onClick={(e) => e.preventDefault()}
      >
        <ReactCountryFlag
          svg
          className="country-flag flag-icon"
          countryCode={
            i18n.language === "en"
              ? "us"
              : i18n.language === "pt-BR"
              ? "br"
              : i18n.language
          }
        />
      </DropdownToggle>
      <DropdownMenu className="mt-0" end>
        <DropdownItem
          href="/"
          tag="a"
          onClick={(e) => handleLangUpdate(e, "br")}
        >
          <ReactCountryFlag className="country-flag" countryCode="br" svg />
          <span className="ms-1">Português-Brasil</span>
        </DropdownItem>
        <DropdownItem
          href="/"
          tag="a"
          onClick={(e) => handleLangUpdate(e, "en")}
        >
          <ReactCountryFlag className="country-flag" countryCode="us" svg />
          <span className="ms-1">English-USA</span>
        </DropdownItem>
        <DropdownItem
          href="/"
          tag="a"
          onClick={(e) => handleLangUpdate(e, "es")}
        >
          <ReactCountryFlag className="country-flag" countryCode="es" svg />
          <span className="ms-1">Español-España</span>
        </DropdownItem>
        <DropdownItem
          href="/"
          tag="a"
          onClick={(e) => handleLangUpdate(e, "pt")}
        >
          <ReactCountryFlag className="country-flag" countryCode="pt" svg />
          <span className="ms-1">Português-Portugal</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default IntlDropdown
