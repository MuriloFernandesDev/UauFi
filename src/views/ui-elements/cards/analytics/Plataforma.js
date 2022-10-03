// ** Third Party Components
import Chart from "react-apexcharts"

// ** Reactstrap Imports
import { Card, CardTitle, CardBody, Row, Col } from "reactstrap"

const Plataforma = () => {
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: { show: false },
    comparedResult: [2, -3, 8],
    labels: ["App", "Service", "Product", "Product2"],
    stroke: { width: 0 },
    // colors: ['#28c76f66', '#28c76f33', success],
    grid: {
      padding: {
        right: -20,
        bottom: -8,
        left: -20,
      },
    },
    plotOptions: {
      pie: {
        startAngle: -10,
        donut: {
          labels: {
            show: true,
            name: {
              offsetY: 15,
            },
            value: {
              offsetY: -15,
              formatter(val) {
                return `${parseInt(val)} %`
              },
            },
            total: {
              show: true,
              offsetY: 15,
              label: "Android",
              formatter() {
                return "53%"
              },
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 1325,
        options: {
          chart: {
            height: 100,
          },
        },
      },
      {
        breakpoint: 1200,
        options: {
          chart: {
            height: 120,
          },
        },
      },
      {
        breakpoint: 1065,
        options: {
          chart: {
            height: 100,
          },
        },
      },
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 120,
          },
        },
      },
    ],
  }

  return (
    <Card className="earnings-card">
      <CardBody>
        <Row>
          <Col xs="6">
            <CardTitle className="mb-1">Dispositivos</CardTitle>
            <div className="font-small-2 mt-5">Total</div>
            <h5>405.556</h5>
          </Col>
          <Col xs="6">
            <Chart
              options={options}
              series={[53, 16, 31, 20]}
              type="donut"
              height={120}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default Plataforma
