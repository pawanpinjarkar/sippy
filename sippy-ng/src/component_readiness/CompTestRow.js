import './ComponentReadiness.css'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { safeEncodeURIComponent } from '../helpers'
import { StringParam, useQueryParam } from 'use-query-params'
import { Tooltip, Typography } from '@material-ui/core'
import CompReadyCapCell from './CompReadyCapCell'
import PropTypes from 'prop-types'
import React from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

// After clicking a testName on page 3 or 3a, we add that testId (that corresponds
// to that testName) to the api call along with all the other parts we already have.
function testLink(filterVals, componentName, capabilityName, testId) {
  const safeComponentName = safeEncodeURIComponent(componentName)
  const safeCapability = safeEncodeURIComponent(capabilityName)
  const safeTestId = safeEncodeURIComponent(testId)
  const retVal =
    '/component_readiness/test' +
    filterVals +
    `&component=${safeComponentName}` +
    `&capability=${safeCapability}` +
    `&testId=${safeTestId}`
  return retVal
}

// Represents a row when you clicked a capability on page2
// We display tests on the left and results on the right.
export default function CompTestRow(props) {
  // testName is the name of the test (called testName)
  // testId is the unique test ID that maps to the testName
  // results is an array of columns and contains the status value per columnName
  // columnNames is the calculated array of columns
  // filterVals: the parts of the url containing input values
  // component, capability: these are passed because we need them in the /test endpoint
  const {
    testName,
    testSuite,
    testId,
    results,
    columnNames,
    filterVals,
    component,
    capability,
  } = props

  const [componentParam, setComponentParam] = useQueryParam(
    'component',
    StringParam
  )
  const [capabilityParam, setCapabilityParam] = useQueryParam(
    'capability',
    StringParam
  )
  const [testIdParam, setTestIdParam] = useQueryParam('testId', StringParam)

  const handleClick = (event) => {
    if (!event.metaKey) {
      event.preventDefault()
      setComponentParam(component)
      setCapabilityParam(capability)
      setTestIdParam(testId)
      window.location.href =
        '/sippy-ng' + testLink(filterVals, component, capability, testId)
    }
  }

  // Put the testName on the left side with a link to a test specific
  // test report.
  const testNameColumn = (
    <TableCell className={'cr-component-name'} key={testName}>
      <Tooltip title={'Capabilities report for ' + testName}>
        <Typography className="cr-cell-name">
          <Link
            to={testLink(filterVals, component, capability, testId)}
            onClick={handleClick}
          >
            {[testSuite, testName].filter(Boolean).join('.')}
          </Link>
        </Typography>
      </Tooltip>
    </TableCell>
  )

  return (
    <Fragment>
      <TableRow>
        {testNameColumn}
        {results.map((columnVal, idx) => (
          <CompReadyCapCell
            key={'testName-' + idx}
            status={columnVal.status}
            environment={columnNames[idx]}
            testId={testId}
            filterVals={filterVals}
            component={component}
            capability={capability}
          />
        ))}
      </TableRow>
    </Fragment>
  )
}

CompTestRow.propTypes = {
  testName: PropTypes.string.isRequired,
  testSuite: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  results: PropTypes.array.isRequired,
  columnNames: PropTypes.array.isRequired,
  filterVals: PropTypes.string.isRequired,
  component: PropTypes.string.isRequired,
  capability: PropTypes.string.isRequired,
}
