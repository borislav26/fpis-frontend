import React, { useEffect, useState, useRef } from "react"
import Header from './Header'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column} from 'primereact/column'
import axios from "axios"
import SlozenSlucajKoriscenjaDialog from "./SlozenSlucajKoriscenjaDialog"
import { Toast } from "primereact/toast"
import SlozenDeleteModal from "./SlozenDeleteModal"
import PrikazRacunaSaBrutoCenom from "./PrikazRacunaSaBrutoCenom"

const Slozen = () => {

    const [racuniSaBrutoCenom, setRacuniSaBrutoCenom] = useState(false)
    const [mestaIzdavanja, setMestaIzdavanja] = useState([])
    const [radnici, setRadnici] = useState([])
    const [naciniPlacanja, setNaciniPlacnja] = useState([])
    const messageDialog = useRef(null)
    const [updateRacun, setUpdateRacun] = useState(false)
    const [visibleViewDialog, setVisibleViewDialog] = useState(false)
    const [ visibleDialog, setVisibleDialog] = useState(false)
    const [ racunSaBrutoCenom, setRacunSaBrutoCenom] = useState(null)
    const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false)

    useEffect(() => {
        axios.all([
            axios.get('http://localhost:5000/radnici/all'),
            axios.get('http://localhost:5000/mesta-izdavanja/all'),
            axios.get('http://localhost:5000/nacini-placanja/all'),
            axios.get('http://localhost:5000/racuni-sa-bruto-cenom/all')
        ]).then(axios.spread((radniciRes, mestaIzdavanjaRes, naciniPlacanjaRes, racuniSaBrutoCenomRes) => {
            setRacuniSaBrutoCenom(racuniSaBrutoCenomRes.data)
            setMestaIzdavanja(mestaIzdavanjaRes.data)
            setRadnici(radniciRes.data)
            setNaciniPlacnja(naciniPlacanjaRes.data)
        })).catch((err) => {
            console.log('nesto se desilo prilikom dovlacnenja podataka', err)
        })
        
    }, [visibleDialog, visibleDeleteDialog])

    const slozenColumns = [
        {name: 'nacinPlacanja.opisNacinaPlacanja', header: 'Nacin placanja'}, 
        {name: 'mestoIzdavanja.nazivMestaIzdavanja', header: 'Mesto izdavanja'},
        {name: 'radnik.imePrezime', header: 'Radnik'},
        {name: 'rokPlacanja', header: 'Rok placanja'},
        {name: 'datumIzdavanja', header: 'Datum izdavanja'},
        {name: 'ukupnaBrutoCena', header: 'Ukupna bruto cena'},
    ]
    
    const [viewRacun, setViewRacun] = useState(null)

    const openEditDialog = (racun) => {
        setUpdateRacun(true)
        setRacunSaBrutoCenom(racun)
        setVisibleDialog(true)
    }

    const openDeleteDialog = (racun) => {
        setRacunSaBrutoCenom(racun)
        setUpdateRacun(false)
        setVisibleDeleteDialog(true)
    }

    const openCreateDialog = () => {
        setUpdateRacun(false)
        setVisibleDialog(true)
    }

    const openViewDialog = (racun) => {
        setViewRacun(racun)
        setVisibleViewDialog(true)
    }

    const actionButtons = (rowData) => {
        return  <div style={{display: 'flex'}}>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning" onClick={() => openEditDialog(rowData)}/>
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() =>openDeleteDialog(rowData)} />
            <Button icon="pi pi-eye" className="p-button-rounded p-button-info" onClick={() =>openViewDialog(rowData)} />  
        </div>
    }

    return (
        <>
            <Toast ref={messageDialog}/>
            <div className="datatable-header">
                <Header label='Slozen slucaj koriscenja'/>
            </div>
            <div className="datatable-actions">
                <Button onClick={openCreateDialog} label="Dodaj" icon='pi pi-plus' className="add-button p-button-success"/>
            </div>
            <div className="datatable-crud-demo"> 
                <DataTable 
                    value={racuniSaBrutoCenom}
                    responsiveLayout={'scroll'} 
                    style={{width:'100%'}}
                    paginator 
                    rows={10} 
                    rowsPerPageOptions={[5, 10, 25]}
                >
                    {slozenColumns && slozenColumns.map(col => <Column key={col.name} field={col.name} header={col.header}/>)}
                    <Column header={'Akcije'} body={actionButtons}/>
                </DataTable>
            </div>
            <SlozenSlucajKoriscenjaDialog
                visibleDialog={visibleDialog}
                setVisibleDialog={setVisibleDialog}
                racunSaBrutoCenom={racunSaBrutoCenom}
                setRacunSaBrutoCenom={setRacunSaBrutoCenom}
                radnici={radnici}
                mestaIzdavanja={mestaIzdavanja}
                naciniPlacanja={naciniPlacanja}
                messageDialog={messageDialog}
                updateRacun={updateRacun}
            />
            <SlozenDeleteModal 
                visible={visibleDeleteDialog}
                setVisible={setVisibleDeleteDialog}
                racunSaBrutoCenom={racunSaBrutoCenom}
                messageDialog={messageDialog}
            />
            <PrikazRacunaSaBrutoCenom
                visibleDialog={visibleViewDialog}
                setVisibleDialog={setVisibleViewDialog}
                racun={viewRacun}
                setRacun={setViewRacun}
            />
        </>

    )
}

export default Slozen