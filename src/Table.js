import React, { Component, forwardRef } from "react";
import MaterialTable from "material-table";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
//import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import Check from "@material-ui/icons/Save";
//import { Modal, Input } from "antd";

const URL = "https://142.93.108.72/exambackend";



 const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
})); 

export default class MaterialTableDemo extends Component {
  classes = () => {
    this.useStyles();
  };
  state = {
    columns: [
      //{ title: 'Aktivitet ID', field: 'id', editable: 'never', defaultSort: 'desc' },
      {
        field: "added",
        hidden: true,
        defaultSort: "desc"
        //editable: "never"
      },
      {
        title: "Make",
        field: "make",
        filterPlaceholder: "søg navn",
        editable: "never"
      },
      {
        title: "Size",
        field: "bam_id",
        filterPlaceholder: "søg id",
        editable: "onAdd"
      },
      {
        title: "Day Price",
        field: "Day_price",
        cellStyle: {
          width: 30,
          maxWidth: 30
        },
        headerStyle: {
          width: 30,
          maxWidth: 30
        },
        editable: "never"
      },
      {
        title: "Patient distrikt",
        field: "pt_dist",
        cellStyle: {
          width: 30,
          maxWidth: 30
        },
  
     
        editComponent: props => (
          <form className={this.classes.container} noValidate>
            <TextField
              id="datetime-local"
              type={
                props.rowData.begin
                  ? props.rowData.end
                    ? "datetime-local"
                    : "datetime-local"
                  : props.rowData.alg_dist
                  ? "string"
                  : "datetime-local"
              }
              defaultValue={
                props.rowData.begin
                  ? props.rowData.end
                    ? props.rowData.begin
                    : props.rowData.begin
                  : props.rowData.alg_dist
                  ? "Standby"
                  : [] //moment().format("YYYY-MM-DDTHH:mm")
              }
              disabled={
                props.rowData.status === "deleted"
                  ? true
                  : props.rowData.begin
                  ? props.rowData.end
                    ? false //begin True, end: True
                    : false //begin True, end: False
                  : props.rowData.alg_dist
                  ? true // begin: False, end: False
                  : false
              }
              className={this.classes.textField}
              onChange={event => {
                const data = [...this.state.data];
                // console.log(event.target.value);
                // console.log(
                //  " props.rowData.tableData",
                //  props.rowData.tableData
                // );
                props.rowData.tableData // are you editing an already exisiting id
                  ? (data[props.rowData.tableData.id].begin =
                      event.target.value)
                  : this.setState({ newActivityBegin: event.target.value });
                //console.log("Event when adding: ", event.target.value);

                this.setState({ data: data });
              }}
              InputLabelProps={{
                shrink: true
              }}
            />
          
      {
        field: "note",
        editable: "never"
      }
    ],

    data: [],
    bam_ids: [],
    fail: false,
    msg: [],
    //newActivity: [{ begin: null, end: null }] // { begin: null, end: null }
    newActivityBegin: [],
    newActivityEnd: [],
    note: [],
    visibleNoteEdit: false,
    noteNumber: null,
    noteEdited: false
  };

  // Notifaction function to alert user
  createNotification = msg => {
    NotificationManager.error(msg, "Advarsel", 5000, () => {});
  };

  componentDidMount() {
    // console.log("Snakker med activity");
    axios
      .get("/api/activity/")
      .then(response => {
        this.setState({
          data: response.data,
          loading: false
        });
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  update = async (newData, oldData) => {
    // console.log("this.state.data: ", this.state.data);
    // console.log("newData to be send: ", newData);
    await axios
      .post(url + "/api/historyEdit/", {
        type: "edit",
        bam_id: newData.bam_id,
        birth_id: newData.id,
        dateTime_start: newData.begin,
        dateTime_end: newData.end
      })
      .then(response => {
        this.setState({
          fail: response.data[0].fail,
          msg: response.data[0].msg
        });
      })
      .catch(error => {
        console.log(error.response);
      });
    // console.log("FAIL: ", this.state.fail);
    // console.log("MSG: ", this.state.msg);
    if (this.state.fail) {
      this.createNotification(this.state.msg);
      setTimeout(function() {
        window.location.reload();
      }, 3000);
    }
  };

  add = async (data, newData) => {
    //console.log("Det failede ikke");
    // console.log("newData to be send: ", newData);
    data.push(newData);
    //this.setState({ ...this.state, data });
    await axios
      .post(url + "/api/historyEdit/", {
        type: "add",
        bam_id: newData.bam_id,
        pt_dist: newData.pt_dist,
        dateTime_start: newData.begin,
        dateTime_end: newData.end,
        duration: newData.duration
      })
      .then(response => {
        this.setState({
          fail: response.data[0].fail,
          msg: response.data[0].msg
        });
      })
      .catch(error => {
        console.log(error.response);
      });
    if (this.state.fail) {
      this.createNotification(this.state.msg);
      setTimeout(function() {
        window.location.reload();
      }, 3000);
    }
  };

  delete = async newData => {
    await axios
      .post(url + "/api/historyEdit/", {
        type: "delete",
        birth_id: newData.id
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  setModalNotes = status => {
    //console.log("Status: ", status);
    this.setState({
      visibleNoteEdit: status,
      //note: [],
      noteEdited: false
    });
  };

  PostData = async (type, birth_id, note) => {
    await axios
      .post(url + "/mwActivity/", {
        type: type, // type: start or end
        // birth_id to be manipulated
        birth_id: birth_id,
        note: note
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  postNote = note => {
    //console.log("Posting");
    //console.log(note);
    //console.log("value: ", value);
    this.setState({ visibleNoteEdit: false, noteEdited: false });
    if (note !== null) {
      const dataNew = [...this.state.data];
      dataNew[this.state.noteNumber].note = note;
      this.setState({ data: dataNew });
      this.PostData("note", dataNew[this.state.noteNumber].id, note);
    }
  };

  render() {
    //console.log("Data when rendering: ", this.state.data);
    return (
      <div>
        <NotificationContainer />
        <MaterialTable
          data={this.state.data}
          icons={tableIcons}
          title="Historik"
          options={{
            pageSize: 10,
            exportButton: true,
            exportAllData: true,
            filtering: true,
            exportDelimiter: ";",
            addRowPosition: "first"
            //exportCsv: data => console.log(data)
          }}
          columns={this.state.columns}
          // actions={[
          //   rowData => ({
          //     icon: "restore_from_trash",
          //     tooltip: "Gendan slettede aktivitet til seneste stadie",
          //     onClick: (event, rowData) =>
          //       console.log("Du er ved at gendanne, ", rowData.id),
          //     hidden: rowData.status !== "deleted"
          //   })
          // ]}
          actions={[
            rowData => ({
              icon: rowData.note ? "speaker_notes" : "minimize",
              tooltip: rowData.note
                ? rowData.note
                : "Ingen note, klik for at tilføje",
              //disabled: rowData.note ? false : true,
              //hidden: rowData.note !== " " ? false : true
              onClick: (event, rowData) =>
                this.setState({
                  note: rowData.note,
                  visibleNoteEdit: true,
                  noteNumber: rowData.tableData.id
                }) //console.log(rowData.note)
              //  console.log("Du er ved at gendanne, ", rowData.id),
              //hidden: rowData.status !== "deleted"
            })
          ]}
          // translating to Danish
          localization={{
            header: { actions: "Handlinger" },
            body: {
              emptyDataSourceMessage: "Ingen data at vise",
              addTooltip: "Tilføj",
              editRow: {
                deleteText:
                  "Er du sikker på, at du vil slette denne aktivitet? Handlingen kan ikke fortrydes senere",
                cancelTooltip: "Fortryd",
                saveTooltip: "Gem"
              },
              editTooltip: "Redigér",
              deleteTooltip: "Slet"
            },
            toolbar: {
              searchTooltip: "Søg",
              searchPlaceholder: "Søg",
              exportTitle: "Eksportér",
              exportAriaLabel: "Eksportér",
              exportName: "CSV"
            },
            pagination: {
              labelRowsSelect: "rækker",
              labelDisplayedRows: "{from}-{to} rækker ud af {count}",
              firstTooltip: "Første række",
              previousTooltip: "Forrige række",
              nextTooltip: "Næste række",
              lastTooltip: "Sidste række"
            }
          }}
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  newData.id = 2456;
                  //2019-09-12T12:33:00+02:00
                  newData.added = moment().format("YYYY-MM-DDTHH:mm:ssZ");
                  newData.alg_dist = "noh";
                  newData.begin = this.state.newActivityBegin;
                  // console.log(
                  //  "this.state.newActivityBegin",
                  //  this.state.newActivityBegin
                  // );
                  newData.date_shift = newData.begin;
                  newData.end = this.state.newActivityEnd;
                  // console.log(
                  //  "this.state.newActivityEnd",
                  //  this.state.newActivityEnd
                  // );
                  newData.duration = moment(newData.end).diff(
                    moment(newData.begin),
                    "minutes"
                  );
                  //newData.end.getTime() - newData.begin.getTime();
                  newData.mw_dist = "";
                  newData.mw_name = "";
                  newData.status = "completed";
                  // console.log("Data som skal sendes: ", newData);
                  const data = [...this.state.data];
                  newData.bam_id
                    ? newData.pt_dist
                      ? newData.begin && newData.end
                        ? newData.begin < newData.end
                          ? newData.duration < 60 * 24 * 3
                            ? this.add(data, newData)
                            : this.createNotification(
                                "Aktiviteten varer mere end 3 dage"
                              )
                          : this.createNotification(
                              "Sluttidspunkt skal være før starttidspunkt"
                            )
                        : this.createNotification(
                            "Start og slut tidspunkt skal angives"
                          )
                      : this.createNotification(
                          "Der skal angives hvilket distrikt patienten er fra"
                        )
                    : this.createNotification("BAM ID skal udfyldes");
                  this.setState({ ...this.state, data });

                  //fail ? [] : this.add(newData);
                }, 600);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise(resolve => {
                //console.log("onRowUpdate oldData: ", oldData);
                //console.log("onRowUpdate newData: ", newData);
                setTimeout(() => {
                  resolve();
                  const data = [...this.state.data];
                  data[data.indexOf(oldData)].bam_id = newData.bam_id;
                  //this.setState({ ...this.state, data });
                  this.update(data[data.indexOf(oldData)], newData);
                }, 600);
              }),
            onRowDelete: oldData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  // console.log("on delete oldData: ", oldData);
                  const data = [...this.state.data];
                  //data.splice(data.indexOf(oldData), 1);
                  data[data.indexOf(oldData)].status = "deleted";
                  this.setState({ ...this.state, data });
                  this.delete(oldData);
                }, 600);
              }),
            isDeletable: row => (row.status === "deleted" ? false : true),
            isEditable: row => (row.status === "deleted" ? false : true)
          }}
        />
        <NoteModal
          note={this.state.note}
          visible={this.state.visibleNoteEdit}
          setModalNotes={this.setModalNotes}
          postNote={this.postNote}
          edited={this.state.noteEdited}
        ></NoteModal>
      </div>
    );
  }
}