import React from 'react';
import PageNavbar from './PageNavbar'
import ProfileMap from './ProfileMap'
import {
  Card,
  Position,
  Tooltip,
  Icon
} from "@blueprintjs/core";
import '../style/NursingHomeProfile.css';
import SimilarsRow from './SimilarsRow';

export default class NursingHomeProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fpn: "",
      ProviderName: "",
      Address: "",
      City: "",
      state: "",
      Zip: "",
      Phone: "",
      OwnershipType: "",
      ProviderType: "",
      NumberOfAllBeds: "",
      TotalNumberOfOccupiedBeds: "",
      AveResidentsPerDay: "",
      submittedData: "",
      passedQA: "",
      OverallRating: "",
      HealthInspectionRating: "",
      StaffingRating: "",
      QMRating: "",
      TotalWeightedHealthSurveyScore: "",
      NumReportedIncidents: "",
      NumSubstantiatedComplaints: "",
      NumFines: "",
      NumPaymentDenials: "",
      NumPenalties: "",
      ResidentsTotalCovidDeaths: "",
      NumVentilatorsInFacility: "",
      StateAvgOverallRating: "",
      StateAvgHealthInspRating: "",
      StateAvgStaffRating: "",
      StateAvgQMRating: "",
      StateAvgAverageHrsPerResPerDay: "",
      StateAvgReportedIncidents: "",
      StateAvgComplaints: "",
      StateAvgCovidDeaths: "",
      StateAvgVentilatorsInFacility: "",
      StateAvgNumFines: "",
      StateAvgNumPenalties: "",
      OverallAvgOverallRating: "",
      OverallAvgHealthInspRating: "",
      OverallAvgStaffRating: "",
      OverallAvgQMRating: "",
      OverallAvgAverageHrsPerResPerDay: "",
      OverallAvgReportedIncidents: "",
      OverallAvgComplaints: "",
      OverallAvgNumFines: "",
      OverallAvgNumPenalties: "",
      OverallAvgCovidDeaths: "",
      OverallAvgVentilatorsInFacility: "",
      StateRank: "",
      CountFPNs: "",
      OverallRank: "",
      Flag: "",
      flagColor: "",
      flagType: "",
      flagMessage: "",
      nearestReported: [],
    }
  }

  onProfileChange = async (name, state, id, lat, long) => {
    await this.setState({
      ProviderName: name,
      state: state,
      fpn: id,
      latitude: lat,
      longitude: long
    })
    await this.fetchFunction()
  }


  fetchFunction = async () => {
    await fetch(`http://localhost:8081/profile/${this.state.fpn}`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        let queryObj = queries[0];

        this.setState({
          ProviderName: queryObj.ProviderName,
          Address: queryObj.Address,
          City: queryObj.City,
          Zip: queryObj.Zip,
          Phone: queryObj.Phone,
          OwnershipType: queryObj.OwnershipType,
          ProviderType: queryObj.ProviderType,
          NumberOfAllBeds: queryObj.NumberOfAllBeds,
          TotalNumberOfOccupiedBeds: queryObj.TotalNumberOfOccupiedBeds,
          AveResidentsPerDay: queryObj.AveResidentsPerDay,
          OverallRating: queryObj.OverallRating,
          HealthInspectionRating: queryObj.HealthInspectionRating,
          StaffingRating: queryObj.StaffingRating,
          QMRating: queryObj.QMRating,
          TotalWeightedHealthSurveyScore: queryObj.TotalWeightedHealthSurveyScore,
          NumReportedIncidents: queryObj.NumReportedIncidents,
          NumSubstantiatedComplaints: queryObj.NumSubstantiatedComplaints,
          NumFines: queryObj.NumFines,
          NumPaymentDenials: queryObj.NumPaymentDenials,
          NumPenalties: queryObj.NumPenalties,
          ResidentsTotalCovidDeaths: queryObj.ResidentsTotalCovidDeaths,
          NumVentilatorsInFacility: queryObj.NumVentilatorsInFacility,
          passedQA: queryObj.PassedQACheck
        })
      })
      .catch(err => console.log(err));


    await fetch(`http://localhost:8081/hasredflag/${this.props.location.state.id}`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        let queryObj = queries[0];
        this.setState({
          Flag: queryObj.flag,
          flagColor: (queryObj.flag === 'true' ? "red" : "black")
        })
      })
      .catch(err => console.log(err));

    await fetch(`http://localhost:8081/nearestQA/${this.props.location.state.id}`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        let queryDivs = queries.map((genreObj, i) =>
          <SimilarsRow
            key={genreObj.YesFPN}
            id={genreObj.YesFPN}
            state={genreObj.YesState}
            name={genreObj.YesReport}
            latitude={genreObj.Latitude}
            longitude={genreObj.Longitude}
            onProfileChange={this.onProfileChange}
              />
        );
        this.setState({
          nearestQACheck: queryDivs
        })
      })
      .catch(err => console.log(err));


    await fetch(`http://localhost:8081/redflag/${this.props.location.state.id}`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        let queryObj = queries[0];
        this.setState({
          flagType: queryObj.flag,
          flagMessage: (queryObj.flag === 'other_flag' ? 'This property is above the 95th percentile for substantiated complaints, fines, or reported incidents' :
            (queryObj.flag === 'covid_flag' ? 'This property does not submit Covid-19 data, has had a recent Covid-19 outbreak, or does not have adequate PPE supplies' :
              'This property has both a Covid-19 red flag (no data, recent outbreak) and another red flag (high complaints, incidents, fines)'))
        })
      })
      .catch(err => console.log(err));

    await fetch(`http://localhost:8081/stateAvg/${this.state.state}`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        let queryObj = queries[0];
        this.setState({
          StateAvgOverallRating: queryObj.StateAvgOverallRating,
          StateAvgHealthInspRating: queryObj.StateAvgHealthInspRating,
          StateAvgStaffRating: queryObj.StateAvgStaffRating,
          StateAvgQMRating: queryObj.StateAvgQMRating,
          StateAvgAverageHrsPerResPerDay: queryObj.StateAvgAverageHrsPerResPerDay,
          StateAvgReportedIncidents: queryObj.StateAvgReportedIncidents,
          StateAvgComplaints: queryObj.StateAvgComplaints,
          StateAvgNumFines: queryObj.StateAvgNumFines,
          StateAvgNumPenalties: queryObj.StateAvgNumPenalties,
          StateAvgCovidDeaths: queryObj.StateAvgCovidDeaths,
          StateAvgVentilatorsInFacility: queryObj.StateAvgVentilatorsInFacility
        })
      })
      .catch(err => console.log(err));

    await fetch(`http://localhost:8081/overallAvg`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        let queryObj = queries[0];
        this.setState({
          OverallAvgOverallRating: queryObj.OverallAvgOverallRating,
          OverallAvgHealthInspRating: queryObj.OverallAvgHealthInspRating,
          OverallAvgStaffRating: queryObj.OverallAvgStaffRating,
          OverallAvgQMRating: queryObj.OverallAvgQMRating,
          OverallAvgAverageHrsPerResPerDay: queryObj.OverallAvgAverageHrsPerResPerDay,
          OverallAvgReportedIncidents: queryObj.OverallAvgReportedIncidents,
          OverallAvgComplaints: queryObj.OverallAvgComplaints,
          OverallAvgNumFines: queryObj.OverallAvgNumFines,
          OverallAvgNumPenalties: queryObj.OverallAvgNumPenalties,
          OverallAvgCovidDeaths: queryObj.OverallAvgCovidDeaths,
          OverallAvgVentilatorsInFacility: queryObj.OverallAvgVentilatorsInFacility
        })
      })
      .catch(err => console.log(err));

    await fetch(`http://localhost:8081/rank/${this.state.fpn}/${this.state.state}`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        let queryObj = queries[0];
        this.setState({
          StateRank: queryObj.StateRank,
          CountFPNs: queryObj.CountFPNs,
          OverallRank: queryObj.OverallRank
        })
        fetch(`http://localhost:8081/similar/${this.state.fpn}/${this.state.latitude}/${this.state.longitude}/${this.state.state}/${this.state.StateRank}`, {
            method: 'GET'
          })
          .then(res => res.json())
          .then(queries => {
            if (!queries) return;
            let queryDivs = queries.map((genreObj, i) =>
              <SimilarsRow
                key={genreObj.FPN}
                id={genreObj.FPN}
                state={genreObj.State}
                name={genreObj.Name}
                latitude={genreObj.Latitude}
                longitude={genreObj.Longitude}
                onProfileChange={this.onProfileChange}
              />
            );
            this.setState({
              simFPNs: queryDivs
            })
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));

    fetch(`http://localhost:8081/nearestReported/${this.props.location.state.id}`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        let queryDivs = queries.map((genreObj, i) =>
          <SimilarsRow
              key={genreObj.YesFPN}
                    id={genreObj.YesFPN}
                    state={genreObj.YesState}
                    name={genreObj.YesReport}
                    latitude={genreObj.Latitude}
                    longitude={genreObj.Longitude}
                    onProfileChange={this.onProfileChange}
                  />
        );
        this.setState({
          nearestReported: queryDivs
        })
      })
      .catch(err => console.log(err));

    fetch(`http://localhost:8081/covidData/${this.props.location.state.id}`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        this.setState({
          submittedData: queries[0].SubmittedData
        })
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    if (this.props.location) {
      if (this.props.location.state) {
        if (this.props.location.state.name) {
          this.setState({
            name: this.props.location.state.name
          })
        }
        if (this.props.location.state.latitude) {
          this.setState({
            latitude: this.props.location.state.latitude
          })
        }
        if (this.props.location.state.longitude) {
          this.setState({
            longitude: this.props.location.state.longitude
          })
        }
        if (this.props.location.state.state) {
          this.setState({
            state: this.props.location.state.state
          })
        }
        if (this.props.location.state.id) {
          this.setState({
            fpn: this.props.location.state.id
          })
        }
      }
    }

    // get all individual nursing home info from FPN selected
    fetch(`http://localhost:8081/profile/${this.props.location.state.id}`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        let queryObj = queries[0];
        this.setState({
          ProviderName: queryObj.ProviderName,
          Address: queryObj.Address,
          City: queryObj.City,
          Zip: queryObj.Zip,
          Phone: queryObj.Phone,
          OwnershipType: queryObj.OwnershipType,
          ProviderType: queryObj.ProviderType,
          NumberOfAllBeds: queryObj.NumberOfAllBeds,
          TotalNumberOfOccupiedBeds: queryObj.TotalNumberOfOccupiedBeds,
          AveResidentsPerDay: queryObj.AveResidentsPerDay,
          OverallRating: queryObj.OverallRating,
          HealthInspectionRating: queryObj.HealthInspectionRating,
          StaffingRating: queryObj.StaffingRating,
          QMRating: queryObj.QMRating,
          TotalWeightedHealthSurveyScore: queryObj.TotalWeightedHealthSurveyScore,
          NumReportedIncidents: queryObj.NumReportedIncidents,
          NumSubstantiatedComplaints: queryObj.NumSubstantiatedComplaints,
          NumFines: queryObj.NumFines,
          NumPaymentDenials: queryObj.NumPaymentDenials,
          NumPenalties: queryObj.NumPenalties,
          ResidentsTotalCovidDeaths: queryObj.ResidentsTotalCovidDeaths,
          NumVentilatorsInFacility: queryObj.NumVentilatorsInFacility,
          passedQA: queryObj.PassedQACheck
        })
      })
      .catch(err => console.log(err));

    fetch(`http://localhost:8081/hasredflag/${this.props.location.state.id}`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        let queryObj = queries[0];
        this.setState({
          Flag: queryObj.flag,
          flagColor: (queryObj.flag === 'true' ? "red" : "black")
        })
      })
      .catch(err => console.log(err));

    fetch(`http://localhost:8081/nearestQA/${this.props.location.state.id}`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        let queryDivs = queries.map((genreObj, i) =>
          <SimilarsRow
                key={genreObj.YesFPN}
                id={genreObj.YesFPN}
                state={genreObj.YesState}
                name={genreObj.YesReport}
                latitude={genreObj.Latitude}
                longitude={genreObj.Longitude}
                onProfileChange={this.onProfileChange}
              />
        );
        this.setState({
          nearestQACheck: queryDivs
        })
      })
      .catch(err => console.log(err));


    fetch(`http://localhost:8081/redflag/${this.props.location.state.id}`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        let queryObj = queries[0];
        this.setState({
          flagType: queryObj.flag,
          flagMessage: (queryObj.flag === 'other_flag' ? 'This property is above the 95th percentile for substantiated complaints, fines, or reported incidents' :
            (queryObj.flag === 'covid_flag' ? 'This property does not submit Covid-19 data, has had a recent Covid-19 outbreak, or does not have adequate PPE supplies' :
              'This property has both a Covid-19 red flag (no data, recent outbreak) and another red flag (high complaints, incidents, fines)'))
        })
      })
      .catch(err => console.log(err));

    fetch(`http://localhost:8081/stateAvg/${this.props.location.state.state}`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        let queryObj = queries[0];
        this.setState({
          StateAvgOverallRating: queryObj.StateAvgOverallRating,
          StateAvgHealthInspRating: queryObj.StateAvgHealthInspRating,
          StateAvgStaffRating: queryObj.StateAvgStaffRating,
          StateAvgQMRating: queryObj.StateAvgQMRating,
          StateAvgAverageHrsPerResPerDay: queryObj.StateAvgAverageHrsPerResPerDay,
          StateAvgReportedIncidents: queryObj.StateAvgReportedIncidents,
          StateAvgComplaints: queryObj.StateAvgComplaints,
          StateAvgNumFines: queryObj.StateAvgNumFines,
          StateAvgNumPenalties: queryObj.StateAvgNumPenalties,
          StateAvgCovidDeaths: queryObj.StateAvgCovidDeaths,
          StateAvgVentilatorsInFacility: queryObj.StateAvgVentilatorsInFacility
        })
      })
      .catch(err => console.log(err));

    fetch(`http://localhost:8081/overallAvg`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        let queryObj = queries[0];
        this.setState({
          OverallAvgOverallRating: queryObj.OverallAvgOverallRating,
          OverallAvgHealthInspRating: queryObj.OverallAvgHealthInspRating,
          OverallAvgStaffRating: queryObj.OverallAvgStaffRating,
          OverallAvgQMRating: queryObj.OverallAvgQMRating,
          OverallAvgAverageHrsPerResPerDay: queryObj.OverallAvgAverageHrsPerResPerDay,
          OverallAvgReportedIncidents: queryObj.OverallAvgReportedIncidents,
          OverallAvgComplaints: queryObj.OverallAvgComplaints,
          OverallAvgNumFines: queryObj.OverallAvgNumFines,
          OverallAvgNumPenalties: queryObj.OverallAvgNumPenalties,
          OverallAvgCovidDeaths: queryObj.OverallAvgCovidDeaths,
          OverallAvgVentilatorsInFacility: queryObj.OverallAvgVentilatorsInFacility
        })
      })
      .catch(err => console.log(err));

    fetch(`http://localhost:8081/rank/${this.props.location.state.id}/${this.props.location.state.state}`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        let queryObj = queries[0];
        this.setState({
          StateRank: queryObj.StateRank,
          CountFPNs: queryObj.CountFPNs,
          OverallRank: queryObj.OverallRank
        })
        fetch(`http://localhost:8081/similar/${this.props.location.state.id}/${this.props.location.state.latitude}/${this.props.location.state.longitude}/${this.props.location.state.state}/${this.state.StateRank}`, {
            method: 'GET'
          })
          .then(res => res.json())
          .then(queries => {
            if (!queries) return;
            let queryDivs = queries.map((genreObj, i) =>
              <SimilarsRow
                key={genreObj.FPN}
                name={genreObj.Name}
                state={genreObj.State}
                id={genreObj.FPN}
                latitude={genreObj.Latitude}
                longitude={genreObj.Longitude}
                onProfileChange={this.onProfileChange} />
            );
            this.setState({
              simFPNs: queryDivs
            })
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));

    fetch(`http://localhost:8081/nearestReported/${this.props.location.state.id}`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        let queryDivs = queries.map((genreObj, i) =>
          <SimilarsRow
            key={genreObj.YesFPN}
            id={genreObj.YesFPN}
            state={genreObj.YesState}
            name={genreObj.YesReport}
            latitude={genreObj.Latitude}
            longitude={genreObj.Longitude}
            onProfileChange={this.onProfileChange}
          />
        );
        this.setState({
          nearestReported: queryDivs
        })
      })
      .catch(err => console.log(err));

    fetch(`http://localhost:8081/covidData/${this.props.location.state.id}`, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(queries => {
        if (!queries) return;
        this.setState({
          submittedData: queries[0].SubmittedData
        })
      })
      .catch(err => console.log(err));
  }

  qaCheckComponent = () => {
    if (this.state.submittedData === 'N') {
      return <h2 className='botTitle'>{this.state.ProviderName} has no data on QA check <Tooltip modifiers={{
        preventOverflow: { enabled: false },
        flip: { enabled: false }
      }}
        className="tick-tooltip"
        content={`${this.state.ProviderName} has no data on QA check, it may or may not have passed its QA check`} position={Position.TOP}>
        <Icon icon="warning-sign" iconSize={20} color="orange"/>
      </Tooltip></h2>
    } else {
      return <h2 className='botTitle'>{this.state.ProviderName} passed QA check <Icon icon="small-tick" iconSize={20} color="green"/></h2>
    }
  }

  noLatLong = () => {
    if (!this.state.longitude && !this.state.latitude) {
      return (<div>Unfortunately this nursing home has not provided location data, so we cannot provide the next nearest nursing home</div>)
    }
  }

  stateMap = {
    AZ: 'Arizona',
    AL: 'Alabama',
    AK: 'Alaska',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DC: 'District of Columbia',
    DE: 'Delaware',
    FL: 'Florida',
    GA: 'Georgia',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    NC: 'North Carolina',
    ND: 'North Dakota',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VT: 'Vermont',
    VA: 'Virginia',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming'
  }

  isBetterThanState = () => {
    var totalProfile = 0;
    if (this.state.OverallRating && this.state.HealthInspectionRating && this.state.StaffingRating && this.state.QMRating) {
      totalProfile = (this.state.OverallRating) + (this.state.HealthInspectionRating) + (this.state.StaffingRating) + (this.state.QMRating)
    }
    var totalState = 0;
    if (this.state.StateAvgOverallRating && this.state.StateAvgHealthInspRating && this.state.StateAvgStaffRating && this.state.StateAvgQMRating) {
      totalState = (this.state.StateAvgOverallRating) + (this.state.StateAvgHealthInspRating) + (this.state.StateAvgStaffRating) + (this.state.StateAvgQMRating)
    }
    if (totalProfile > totalState && totalState !== 0 && totalProfile !== 0) {
      return (
        <Tooltip
          modifiers={{
            preventOverflow: { enabled: false },
            flip: { enabled: false }
          }}
          className="tick-tooltip"
          position={Position.RIGHT}
          content={`${this.state.ProviderName} is rated better than the average rating of all nursing homes in ${this.stateMap[this.state.state]}`}
        >
          <Icon icon="endorsed" iconSize={20} color="green"/>
        </Tooltip>
      )
    } else {
      return (
        <Tooltip
          modifiers={{
            preventOverflow: { enabled: false },
            flip: { enabled: false }
          }}
          className="tick-tooltip"
          position={Position.RIGHT}
          content={`${this.state.ProviderName} is rated worse than the average rating of all nursing homes in ${this.stateMap[this.state.state]}`}
        >
          <Icon icon="ban-circle" iconSize={20} color="red"/>
        </Tooltip>
      )
    }
  }

  isBetterThanOverall = () => {
    var totalState = 0;
    if (this.state.StateAvgOverallRating && this.state.StateAvgHealthInspRating && this.state.StateAvgStaffRating && this.state.StateAvgQMRating) {
      totalState = (this.state.StateAvgOverallRating) + (this.state.StateAvgHealthInspRating) + (this.state.StateAvgStaffRating) + (this.state.StateAvgQMRating)

    }
    var totalOverall = 0;
    if (this.state.OverallAvgOverallRating && this.state.OverallAvgHealthInspRating && this.state.OverallAvgStaffRating && this.state.OverallAvgQMRating) {
      totalOverall = (this.state.OverallAvgOverallRating) + (this.state.OverallAvgHealthInspRating) + (this.state.OverallAvgStaffRating) + (this.state.OverallAvgQMRating)
    }
    if (totalState > totalOverall && totalState !== 0 && totalOverall !== 0) {
      return (
        <Tooltip
          modifiers={{
            preventOverflow: { enabled: false },
            flip: { enabled: false }
          }}
          className="tick-tooltip"
          position={Position.RIGHT}
          content={`Nursing homes in ${this.stateMap[this.state.state]} are rated better than the average rating of all nursing homes in the nation`}
        >
          <Icon icon="endorsed" iconSize={20} color="green"/>
        </Tooltip>
      )
    } else {
      return (
        <Tooltip
          modifiers={{
            preventOverflow: { enabled: false },
            flip: { enabled: false }
          }}
          className="tick-tooltip"
          position={Position.RIGHT}
          content={`Nursing homes in ${this.stateMap[this.state.state]} are rated worse than the average rating of all nursing homes in the nation`}
        >
          <Icon icon="ban-circle" iconSize={20} color="red"/>
        </Tooltip>
      )
    }
  }

  formatPhoneNumber = (phoneNumberString) => {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return null
  }



  render() {
    return (
      <div className="profile-page">
        <PageNavbar selected={this.state.ProviderName} active="profile"/>
        <div className='profile-page-card'>
          <div className='top-row'>
            <div className='profile-info'>
              <h1>{this.state.ProviderName}</h1>
              <div>
                {this.state.Flag ==='true' ?
                  <Tooltip modifiers={{
                    preventOverflow: { enabled: false },
                    flip: { enabled: false }
                  }}
                    className="tick-tooltip"
                    content={this.state.flagMessage} position={Position.RIGHT}>
                    <Icon icon="flag" iconSize={20} color={this.state.flagColor}/>
                  </Tooltip> : <div></div>}
                <p>Address: {this.state.Address}, {this.state.City}, {this.state.state}, {this.state.Zip}</p>
                <p>Phone Number: {this.formatPhoneNumber(this.state.Phone)}</p>
                <p>Ownership Type: {this.state.OwnershipType} </p>
                <p>Provider Type: {this.state.ProviderType} </p>
                <p>Occupied Beds (as of 10/1): {this.state.TotalNumberOfOccupiedBeds}/{this.state.NumberOfAllBeds}</p>
                <p>Average # Residents Per Day: {this.state.AveResidentsPerDay}</p>
                <p>State Rank: {this.state.StateRank}/{this.state.CountFPNs}</p>
                <p>Overall Rank: {this.state.OverallRank}/15,342</p>
              </div>
            </div>
            <div className='static-map-container'>
              {(this.state.latitude && this.state.longitude )
                  ?
                    <ProfileMap
                      name={this.state.name}
                      latitude={this.state.latitude}
                      longitude={this.state.longitude}
                    />
                  : ""}
            </div>
          </div>
          <div className='middle-row'>
            <Card className='ratings-card'>
              <h2>Statistics {this.isBetterThanState()}</h2>
              <p>Residents Total Covid Deaths #: {this.state.ResidentsTotalCovidDeaths}</p>
              <p>Ventilators In Facility #: {this.state.NumVentilatorsInFacility}</p>
              <p>Overall Rating: {this.state.OverallRating}/5</p>
              <p>Health Inspection Rating: {this.state.HealthInspectionRating}/5</p>
              <p>Staffing Rating: {this.state.StaffingRating}/5</p>
              <p>Quality Measure Rating: {this.state.QMRating}/5</p>
              <p>Reported Incidents #: {this.state.NumReportedIncidents}</p>
              <p>Substantiated Complaints #: {this.state.NumSubstantiatedComplaints}</p>
              <p>Fines #: {this.state.NumFines}</p>
              <p>Penalties #: {this.state.NumPenalties}</p>
            </Card>
            <Card className='hours-card'>
              <h2>{this.stateMap[this.state.state]}  State Averages {this.isBetterThanOverall()}</h2>
              <p>Covid Deaths #: {this.state.StateAvgCovidDeaths}</p>
              <p>Ventilators #: {this.state.StateAvgVentilatorsInFacility}</p>
              <p>Overall Rating: {this.state.StateAvgOverallRating}/5</p>
              <p>Health Inspection Rating: {this.state.StateAvgHealthInspRating}/5</p>
              <p>Staffing Rating: {this.state.StateAvgStaffRating}/5</p>
              <p>Quality Measure Rating: {this.state.StateAvgQMRating}/5</p>
              <p>Reported Incidents #: {this.state.StateAvgReportedIncidents}</p>
              <p>Substantiated Complaints #: {this.state.StateAvgComplaints}</p>
              <p>Fines #: {this.state.StateAvgNumFines}</p>
              <p>Penalties #: {this.state.StateAvgNumPenalties}</p>
            </Card>
            <Card className='others-card'>
              <h2>Overall Averages</h2>
              <p>Covid Deaths #: {this.state.OverallAvgCovidDeaths}</p>
              <p>Ventilators #: {this.state.OverallAvgVentilatorsInFacility}</p>
              <p>Overall Rating: {this.state.OverallAvgOverallRating}/5</p>
              <p>Health Inspection Rating: {this.state.OverallAvgHealthInspRating}/5</p>
              <p>Staffing Rating: {this.state.OverallAvgStaffRating}/5</p>
              <p>Quality Measure Rating: {this.state.OverallAvgQMRating}/5</p>
              <p>Reported Incidents #: {this.state.OverallAvgReportedIncidents}</p>
              <p>Substantiated Complaints #: {this.state.OverallAvgComplaints}</p>
              <p>Fines #: {this.state.OverallAvgNumFines}</p>
              <p>Penalties #: {this.state.OverallAvgNumPenalties}</p>
            </Card>
          </div>
          <div className='bottom-row'>
            <Card className='additional-card'>
              <div className='bot-col1'>
                <h2 className='botTitle'>Here are some similar nursing homes  {this.state.simFPNs ?
                  <Tooltip
                    modifiers={{
                      preventOverflow: { enabled: false },
                      flip: { enabled: false }
                    }}
                    className="tick-tooltip"
                    position={Position.RIGHT}
                    content="Similar nursing homes are identified based on ranking and proximity."
                  >
                    <Icon icon="info-sign" iconSize={20} color="black"/>
                  </Tooltip> : <></>}</h2>
                <div className="results-container" id="results">
                  {this.state.simFPNs}
                </div>
              </div>
              <div className='bot-col2'>
                {this.state.passedQA && this.state.passedQA ==='N' ?
                  <div>
                    <h2 className='botTitle'>Here is the closest nursing home that passed QA Check  <Tooltip modifiers={{
                      preventOverflow: { enabled: false },
                      flip: { enabled: false }
                    }}
                      className="tick-tooltip"
                      content={`${this.state.ProviderName} did not pass a QA check, consider this nursing home instead`} position={Position.TOP}>
                      <Icon icon="info-sign" iconSize={20} color="red"/>
                    </Tooltip></h2>
                    <div className="results-container" id="results">
                      {this.state.nearestQACheck}
                      {this.noLatLong()}
                    </div>
                  </div> : this.qaCheckComponent() }
              </div>
              <div className='bot-col3'>
                {this.state.submittedData && this.state.submittedData === 'N' ?
                  <div >
                    <h2 className='botTitle'>Here is the closest nursing home that reported Covid-19 data  <Tooltip modifiers={{
                      preventOverflow: { enabled: false },
                      flip: { enabled: false }
                    }}
                      className="tick-tooltip"
                      content={`${this.state.ProviderName} did not submit Covid-19 data, consider this nursing home instead`} position={Position.LEFT}>
                      <Icon icon="info-sign" iconSize={20} color="red"/>
                    </Tooltip></h2>
                    <div className="results-container" id="results">
                      {this.state.nearestReported}
                      {this.noLatLong()}
                    </div>
                  </div>: <h2 className='botTitle'>{this.state.ProviderName} reported Covid-19 data <Icon icon="small-tick" iconSize={20} color="green"/></h2>}
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}