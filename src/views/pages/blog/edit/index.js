// ** React Imports
import { useState, useEffect } from 'react'

// ** Third Party Components
import api from '../../../../services/api'
import Select from 'react-select'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Row, Col, Card, CardBody, CardText, Form, Label, Input, Button } from 'reactstrap'

// ** Styles
import '@styles/react/libs/editor/editor.scss'
import '@styles/base/plugins/forms/form-quill-editor.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/base/pages/page-blog.scss'

const BlogEdit = () => {
  
  // ** States
  const [data, setData] = useState(null),
    [title, setTitle] = useState(''),
    [blogCategories, setBlogCategories] = useState([])

  useEffect(() => {
    api.get('/cliente_login/0/0').then(res => {
      setData(res.data[0])
      setTitle(res.data[0]?.email)
      setBlogCategories(res.data[0]?.hotspots)
    })
  }, [])

  const categories = [
    { value: 'fashion', label: 'Fashion' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'quote', label: 'Quote' },
    { value: 'video', label: 'Video' },
    { value: 'food', label: 'Food' }
  ]

  return (
    <div className='blog-edit-wrapper'>
      {data !== null ? (
        <Row>
          <Col sm='12'>
            <Card>
              <CardBody>
                <Form onSubmit={e => e.preventDefault()}>
                  <Row>
                    <Col md='6' className='mb-2'>
                      <Label className='form-label' for='blog-edit-title'>
                        E-mail
                      </Label>
                      <Input id='blog-edit-title' value={title} onChange={e => setTitle(e.target.value)} />
                    </Col>
                    <Col md='6' className='mb-2'>
                      <Label className='form-label' for='blog-edit-category'>
                        Hotspots
                      </Label>
                      <Select
                        id='blog-edit-category'
                        isClearable={false}
                        theme={selectThemeColors}
                        value={blogCategories}
                        isMulti
                        name='colors'
                        options={categories}
                        className='react-select'
                        classNamePrefix='select'
                        onChange={data => setBlogCategories(data)}
                      />
                    </Col>
                    <Col className='mt-50'>
                      <Button color='primary' className='me-1'>
                        Salvar
                      </Button>
                      <Button color='secondary' outline>
                        Cancelar
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : null}
    </div>
  )
}

export default BlogEdit
