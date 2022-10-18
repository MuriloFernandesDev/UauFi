// ** React Imports
import { Fragment } from "react"

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, Input, Label, Button } from "reactstrap"

// ** Icons Imports
import { Check, X, Link, Trash } from "react-feather"

const socialAccounts = [
  {
    linked: false,
    title: "Android",
    logo: require("@src/assets/images/icons/social/facebook.png").default,
  },
  {
    linked: true,
    title: "iOS",
    url: "https://twitter.com/pixinvent",
    logo: require("@src/assets/images/icons/social/twitter.png").default,
  },
  {
    linked: true,
    title: "Windows",
    url: "https://www.linkedin.com/company/pixinvent/",
    logo: require("@src/assets/images/icons/social/twitter.png").default,
  },
]

const connections = () => {
  return (
    <Fragment>
      <Card>
        <CardBody>
          <CardTitle className="mb-75">Dispositivos utilizados</CardTitle>
          {socialAccounts.map((item, index) => {
            return (
              <div key={index} className="d-flex mt-2">
                <div className="flex-shrink-0">
                  <img
                    className="me-1"
                    src={item.logo}
                    alt={item.title}
                    height="38"
                    width="38"
                  />
                </div>
                <div className="d-flex align-item-center justify-content-between flex-grow-1">
                  <div className="me-1">
                    <p className="fw-bolder mb-0">{item.title}</p>

                    <span>AA:AA:AA:AA:AA:AA</span>
                  </div>
                  <div className="mt-50 mt-sm-0">
                    <Button outline className="btn-icon">
                      <Trash className="font-medium-3 text-danger" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default connections
