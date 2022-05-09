import React, { useEffect, useRef, useState } from "react"
import './Prost.css'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast' 
import 'primereact/resources/primereact.min.css'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primeicons/primeicons.css'
import Header from "./Header" 
import './ProsSlucajKoriscenjaDialog'
import ProstSlucajKoriscenjaDialog from "./ProsSlucajKoriscenjaDialog"
import axios from 'axios'
import DeleteModal from "./DeleteModal"


const Prost = () => {

    const [visibleDialogCreate, setVisibleDialogCreate] = useState(false)
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false) 

    useEffect(async () => {
        await axios.all([
            axios.get('http://localhost:5000/radnici/all'), 
            axios.get('http://localhost:5000/korisnici/all'),
            axios.get('http://localhost:5000/obavestenja-o-izvrsenim-uplatama-prevoza/all'),
            axios.get('http://localhost:5000/obavestenja-o-izvrsenim-uplatama-osiguranja/all'),
            axios.get('http://localhost:5000/obavestenja-o-izvrsenim-uplatama-hotela/all'),
            axios.get('http://localhost:5000/obavestenja-o-svim-izvrsenim-uplatama/all')
        ])
        .then(axios.spread((
            radniciRes, 
            korisniciRes, 
            obavestenjaOIzvrsenimUplatamaPrevozaRes, 
            obavestenjaOIzvrsenimUplatamaOsiguranjaRes,
            obavestenjaOIzvrsenimUplatamaHotelaRes,
            obavestenjaOSvimIzvrsenimUplatama
        ) => {
            setKorisnici(korisniciRes.data)
            setRadnici(radniciRes.data)
            setObavestenjaOIzvrsenimUplatamaPrevoza(obavestenjaOIzvrsenimUplatamaPrevozaRes.data)
            setObavestenjaOIzvrsenimUplatamaOsiguranja(obavestenjaOIzvrsenimUplatamaOsiguranjaRes.data)
            setObavestenjaOIzvrsenimUplatamaHotela(obavestenjaOIzvrsenimUplatamaHotelaRes.data)
            setObavestenjaOSvimIzvrsenimUplatama(obavestenjaOSvimIzvrsenimUplatama.data)
        }))
        .catch((err) => {
            console.log(err)
        })

    }, [visibleDialogCreate, deleteDialogVisible])

    const messageDialog = useRef(null)

    const [radnici, setRadnici] = useState([])
    const [korisnici, setKorisnici] = useState([])
    const [obavestenjaOIzvrsenimUplatamaPrevoza, setObavestenjaOIzvrsenimUplatamaPrevoza] = useState([])
    const [obavestenjaOIzvrsenimUplatamaOsiguranja, setObavestenjaOIzvrsenimUplatamaOsiguranja] = useState([])
    const [obavestenjaOIzvrsenimUplatamaHotela, setObavestenjaOIzvrsenimUplatamaHotela] = useState([])
    const [obavestenjaOSvimIzvrsenimUplatama, setObavestenjaOSvimIzvrsenimUplatama] = useState([])

    const [obavestenje, setObavestenje] = useState(null)
    const [obavestenjeDelete, setObavestenjeDelete] = useState(null)
    const [updateObavestenje, setUpdateObavestenje] = useState(false) 

    const prostColumns = [
        {name: 'svrhaObavestenja', header: 'Svrha obavestenja'}, 
        {name: 'datumObavestenja', header: 'Datum obavestenja'},
        {name: 'korisnik.imePrezime', header: 'Korisnik'},
        {name: 'radnik.imePrezime', header: 'Radnik'},
        {name: 'obavestenjeOIzvrsenojUplatiHotela.svrha', header: 'Obavestenje o izvrsenoj uplati hotela'},
        {name: 'obavestenjeOIzvrsenojUplatiOsiguranja.svrha', header: 'Obavestenje o izvrsenoj uplati osiguranja'},
        {name: 'obavestenjeOIzvrsenojUplatiPrevoza.svrha', header: 'Obavestenje o izvrsenoj uplati prevoza'},
    ]

    const showCreateDialog = () => {
        setUpdateObavestenje(false)
        setVisibleDialogCreate(true)
    }

    const openEditDialog = (obavestenje) => {
        setUpdateObavestenje(true)
        setObavestenje(obavestenje)
        setVisibleDialogCreate(true)
    }

    const openDeleteDialog = (obavestenje) => {
        setUpdateObavestenje(false)
        setObavestenjeDelete(obavestenje.id)
        setDeleteDialogVisible(true)
    }

    const actionButtons = (rowData) => {
        return  <div style={{display: 'flex'}}>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning" onClick={() => openEditDialog(rowData)}/>
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() =>openDeleteDialog(rowData)} />  
        </div>
    }

    return (
        <>
            <div className="datatable-header">
                <Header label='Prost slucaj koriscenja'/>
            </div>
            <div className="datatable-actions">
                <Button onClick={showCreateDialog} label="Dodaj" icon='pi pi-plus' className="add-button p-button-success"/>
            </div>
            <div className="datatable-crud-demo"> 
                <DataTable 
                    value={obavestenjaOSvimIzvrsenimUplatama} 
                    responsiveLayout={'scroll'} 
                    style={{width:'100%'}}
                    paginator 
                    rows={10} 
                    rowsPerPageOptions={[5, 10, 25]}
                >
                    {prostColumns && prostColumns.map(col => <Column key={col.name} field={col.name} header={col.header}/>)}
                    <Column header={'Akcije'} body={actionButtons}/>
                </DataTable>
            </div>
            <ProstSlucajKoriscenjaDialog
                visibleDialogCreate={visibleDialogCreate}
                setVisibleDialogCreate={setVisibleDialogCreate}
                radnici={radnici}
                korisnici={korisnici}
                obavestenjaOIzvrsenimUplatamaPrevoza={obavestenjaOIzvrsenimUplatamaPrevoza}
                obavestenjaOIzvrsenimUplatamaOsiguranja={obavestenjaOIzvrsenimUplatamaOsiguranja}
                obavestenjaOIzvrsenimUplatamaHotela={obavestenjaOIzvrsenimUplatamaHotela}
                obavestenje={obavestenje}
                setObavestenje={setObavestenje}
                updateObavestenje={updateObavestenje}
            />
            <DeleteModal 
                visible={deleteDialogVisible}
                setVisible={setDeleteDialogVisible}
                messageDialog={messageDialog}
                obavestenjeID={obavestenjeDelete}
            />
            <Toast ref={messageDialog}/>
        </>

    )
}

export default Prost