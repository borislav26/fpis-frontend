import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import React, { useEffect, useState } from "react"
import Form from "./Form"
import './Slozen.css'

const PrikazRacunaSaBrutoCenom = props => {
    const { racun, setRacun, visibleDialog, setVisibleDialog } = props

    const [ brojRacuna, setBrojRacuna ] = useState('')
    const [ datumIzdavanja, setDatumIzdavanja ] = useState('')
    const [ osnova, setOsnova ] = useState('')
    const [ mestoIzdavanja, setMestoIzdavanja ] = useState('')
    const [ nacinPlacanja, setNacinPlacanja ] = useState('')
    const [ rokPlacanja, setRokPlacanja ] = useState('')
    const [ stavke, setStavke ] = useState([])
    const [ odgovornoLice, setOdgovornoLice ] = useState('')
    const [ ukupanIznos, setUkupanIznos] = useState('')

    useEffect(() => {
        console.log(racun)
        if (racun) {
            setBrojRacuna(racun.brojRacuna)
            setDatumIzdavanja(new Date(racun.datumIzdavanja))
            setOsnova(racun.osnova)
            setRokPlacanja(new Date(racun.rokPlacanja))
            setUkupanIznos(racun.ukupnaBrutoCena)
            if (racun.mestoIzdavanja) {
                setMestoIzdavanja(racun.mestoIzdavanja.nazivMestaIzdavanja)
            }
            if (racun.nacinPlacanja) {
                setNacinPlacanja(racun.nacinPlacanja.opisNacinaPlacanja)
            }
            if (racun.radnik) {
                setOdgovornoLice(racun.radnik.imePrezime)
            }
            if (racun.stavke.length > 0) {
                setStavke(racun.stavke)
            }
         }
    }, [racun])

    const hideDialog = () => {
        setRacun(null)
        setVisibleDialog(false)
    }

    return (
        <Dialog 
            header='Prikaz racuna sa bruto cenom' 
            visible={visibleDialog} 
            onHide={hideDialog}
            closable={false}
        >
        <Form>
        <div className="add-dialog-first-row">
            <div>
                <label className="label" htmlFor="brojRacuna">Broj racuna</label>
                <InputText color="gray" disabled id='brojRacuna' value={brojRacuna}/>
            </div>
            <div>
                <label className="label" htmlFor="datumIzdavanja">Datum izdavanja</label>
                <Calendar disabled value={new Date(datumIzdavanja)} showIcon id='datumIzdavanja' name='datumIzdavanja'/>
            </div>
        </div>
        <div className="add-dialog-first-row" style={{alignItems: 'center'}}>
            <div>
                <div>
                    <label className="label" htmlFor="osnova">Osnova</label>
                </div>
                <InputTextarea disabled value={osnova} id='osnova' name='osnova' />
            </div>
            <div>
                <label className="label" htmlFor="idObavestenja">Mesto izdavanja:</label>
                <InputText disabled color="gray" id='ukupanIznos' value={mestoIzdavanja}/>
            </div>
        </div>
        <div className="add-dialog-first-row" style={{alignItems: 'center'}}>
            <div>
                <label className="label" htmlFor="rokPlacanja">Rok placanja</label>
                <Calendar disabled value={new Date(rokPlacanja)} showIcon id='rokPlacanja' name='datumIzdavanja'/>
            </div>
            <div>
                <label className="label" htmlFor="idObavestenja">Nacin placanja:</label>
                <InputText disabled color="gray" id='ukupanIznos' value={nacinPlacanja}/>
            </div>
        </div>
        <hr></hr>
            <div className='stavke-racuna-box'>
                <DataTable
                    value={stavke} 
                    responsiveLayout={'scroll'} 
                    style={{width:'100%'}}
                    paginator 
                    rows={10} 
                    rowsPerPageOptions={[5, 10, 25]}
                >
                    <Column key='nazivStavke' field='nazivStavke' header='Naziv stavke'/>
                    <Column key='redniBroj' field='redniBroj' header='Redni broj'/>
                    <Column key='netoCena' field='netoCena' header='Neto cena'/>
                    <Column key='marza' field='marza' header='Marza'/>
                    <Column key='brutoCena' field='brutoCena' header='Bruto cena'/>
                    <Column key='brojRacuna' field='brojRacuna' header='Broj racuna'/>
                </DataTable>
            </div>
        <hr></hr>
        <div className="add-dialog-first-row" style={{alignItems: 'center'}}>
            <div>
                <label className="label" htmlFor="idObavestenja">Odgovorno lice:</label>
                <InputText disabled color="gray" id='ukupanIznos' value={odgovornoLice}/>
            </div>
            <div>
                <label className="label" htmlFor="ukupanIznos">Ukupan iznos</label>
                <InputText color="gray" disabled id='ukupanIznos' value={ukupanIznos}/>
            </div>
        </div>
        <div className="add-dialog-third-row" style={{justifyContent: 'space-around', marginTop: '30px'}}>
            <Button label="Sakrij" className="p-button-danger" onClick={hideDialog}/>
        </div>
        </Form>
    </Dialog>
    )
}

export default PrikazRacunaSaBrutoCenom