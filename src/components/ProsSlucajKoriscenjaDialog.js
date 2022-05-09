import React, { useEffect, useRef, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import './Prost.css'
import Form from './Form.js'
import axios from 'axios'
import { Toast } from 'primereact/toast'

const ProstSlucajKoriscenjaDialog = props => {
    const OBAVESTENJE_HOTEL = "HOTEL"
    const OBAVESTENJE_PREVOZ = "PREVOZ"
    const OBAVESTENJE_OSIGURANJE = "OSIGURANJE"
    const errorMessage = useRef(null)
    const dialogRef = useRef(null)

    const { 
        visibleDialogCreate,
        setVisibleDialogCreate,
        radnici,
        korisnici,
        obavestenjaOIzvrsenimUplatamaPrevoza,
        obavestenjaOIzvrsenimUplatamaOsiguranja,
        obavestenjaOIzvrsenimUplatamaHotela,
        obavestenje,
        setObavestenje,
        updateObavestenje
     } = props 

     useEffect(() => {
         if (obavestenje) {
            setIdObavestenjaDialog(obavestenje.id)
            setSvrhaObavestenja(obavestenje.svrhaObavestenja)
            setDatumUnosaDialog(new Date(obavestenje.datumObavestenja))
            if (obavestenje.radnik) {
                setSelectedRadnik(obavestenje.radnik.sifraRadnika)
            }
            if (obavestenje.radnik) {
                setSelectedRadnik(obavestenje.radnik.sifraRadnika)
            }
            if (obavestenje.korisnik) {
                setSelectedKorisnik(obavestenje.korisnik.jmbg)
            }
            if (obavestenje.obavestenjeOIzvrsenojUplatiPrevoza) {
                setSelectedObavestenjeOIzvrsenojUplatiPrevoza(obavestenje.obavestenjeOIzvrsenojUplatiPrevoza.id)
                setSelectedPrevoz(obavestenje.obavestenjeOIzvrsenojUplatiPrevoza.svrha)
            }
            if (obavestenje.obavestenjeOIzvrsenojUplatiOsiguranja) {
                setSelectedObavestenjeOIzvrsenojUplatiOsiguranja(obavestenje.obavestenjeOIzvrsenojUplatiOsiguranja.id)
                setSelectedOsiguranje(obavestenje.obavestenjeOIzvrsenojUplatiOsiguranja.svrha)
            }
            if (obavestenje.obavestenjeOIzvrsenojUplatiHotela) {
                setSelectedObavestenjeOIzvrsenojUplatiHotela(obavestenje.obavestenjeOIzvrsenojUplatiHotela.id)
                setSelectedHotel(obavestenje.obavestenjeOIzvrsenojUplatiHotela.svrha)
            }
         }
        
     }, [obavestenje])

    const [ idObavestenjaDialog, setIdObavestenjaDialog] = useState('')
    const [ svrhaObavestenja, setSvrhaObavestenja ] = useState('')
    const [ datumUnosaDialog, setDatumUnosaDialog ] = useState(null) 
    const [ selectedRadnik, setSelectedRadnik ] = useState(-1)
    const [ selectedKorisnik, setSelectedKorisnik ] = useState(-1)
    const [selectedObavestenjeOIzvrsenojUplatiPrevoza, setSelectedObavestenjeOIzvrsenojUplatiPrevoza] = useState(-1)
    const [selectedObavestenjeOIzvrsenojUplatiOsiguranja, setSelectedObavestenjeOIzvrsenojUplatiOsiguranja] = useState(-1)
    const [selectedObavestenjeOIzvrsenojUplatiHotela, setSelectedObavestenjeOIzvrsenojUplatiHotela] = useState(-1)
    const [selectedOsiguranje, setSelectedOsiguranje] = useState(null)
    const [selectedPrevoz, setSelectedPrevoz] = useState(null)
    const [selectedHotel, setSelectedHotel] = useState(null)

    const hideCreateDialog = () => {
        setObavestenje(null)
        setIdObavestenjaDialog('')
        setObavestenje(null)
        setVisibleDialogCreate(false)
    }

    const handleSubmitObavestenje = async (e) => {
        e.preventDefault()
        const svrha = svrhaObavestenja
        const datumObavestenja = datumUnosaDialog
        const korisnik = selectedKorisnik
        const obavestenjeOIzvrsenojUplatiHotela = selectedObavestenjeOIzvrsenojUplatiHotela
        const obavestenjeOIzvrsenojUplatiPrevoza = selectedObavestenjeOIzvrsenojUplatiPrevoza
        const obavestenjeOIzvrsenojUplatiOsiguranja = selectedObavestenjeOIzvrsenojUplatiOsiguranja
        const radnik = selectedRadnik

        if (svrha === '') {
            errorMessage.current.show({severity:'error', summary:'Greska', detail: 'Ne mozete da unesete obavestenje bez svrhe', life: 6000})
            return
        }
        if(datumObavestenja === '') {
            errorMessage.current.show({severity:'error', summary:'Greska', detail: 'Morate da izaberete datum obavestenja da bi uneli obavestenje', life: 6000})
            return
        }
        if(korisnik === -1) {
            errorMessage.current.show({severity:'error', summary:'Greska', detail: 'Morate da izaberete korisnika da bi uneli obavestenje', life: 6000})
            return
        }
        if(radnik === -1) {
            errorMessage.current.show({severity:'error', summary:'Greska', detail: 'Morate da izaberete odgovorno lice da bi uneli obavestenje', life: 6000})
            return
        }
        if(obavestenjeOIzvrsenojUplatiHotela === -1) {
            errorMessage.current.show({severity:'error', summary:'Greska', detail: 'Morate da izaberete obavestenje o izvrsenoj uplati hotela da bi uneli obavestenje', life: 6000})
            return
        }
        if(obavestenjeOIzvrsenojUplatiPrevoza === -1) {
            errorMessage.current.show({severity:'error', summary:'Greska', detail: 'Morate da izaberete obavestenje o izvrsenoj uplati prevoza da bi uneli obavestenje', life: 6000})
            return
        }
        if(obavestenjeOIzvrsenojUplatiOsiguranja === -1) {
            errorMessage.current.show({severity:'error', summary:'Greska', detail: 'Morate da izaberete obavestenje o izvrsenoj uplati osiguranja da bi uneli obavestenje', life: 6000})
            return
        }

        if (updateObavestenje) {
            const { data } = await axios.put('http://localhost:5000/obavestenja-o-svim-izvrsenim-uplatama/update', {
                id: idObavestenjaDialog,
                svrhaObavestenja: svrha,
                datumObavestenja,
                korisnik,
                obavestenjeOIzvrsenojUplatiHotela,
                obavestenjeOIzvrsenojUplatiPrevoza,
                obavestenjeOIzvrsenojUplatiOsiguranja,
                radnik,
            })
            if (data.error != null) {
                errorMessage.current.show({severity:'error', summary:'Greska', detail: data.error.message, life: 6000})
                return
            }
            errorMessage.current.show({
                severity:'success', 
                summary:'Uspesna akcija', 
                detail: 'Uspesno je izmennjeno obavestenje o svim izvrsenim uplatama', 
                life: 6000
            })
            hideCreateDialog()
            return  
        }
        const { data } = await axios.post('http://localhost:5000/obavestenja-o-svim-izvrsenim-uplatama/create', {
            svrhaObavestenja: svrha,
            datumObavestenja,
            korisnik,
            obavestenjeOIzvrsenojUplatiHotela,
            obavestenjeOIzvrsenojUplatiPrevoza,
            obavestenjeOIzvrsenojUplatiOsiguranja,
            radnik,
        })
        if (data.error != null) {
            errorMessage.current.show({severity:'error', summary:'Greska', detail: data.error.message, life: 6000})
            return
        }
        errorMessage.current.show({
            severity:'success', 
            summary:'Uspesna akcija', 
            detail: 'Uspesno je kreirano novo obavestenje o svim izvrsenim uplatama', 
            life: 6000
        })
        hideCreateDialog()
    }

    const handleChangeDatumUnosa = (e) => {
        setDatumUnosaDialog(e.target.value)
    }

    const handleChangeSvrhaObavestenja = (e) => {
        setSvrhaObavestenja(e.target.value)
    }

    const handleObavestenjeChange = (tip, obavestenje) => {
        if (tip === OBAVESTENJE_HOTEL) {
            setSelectedObavestenjeOIzvrsenojUplatiHotela(obavestenje)
            const izabranoObavestenje = obavestenjaOIzvrsenimUplatamaHotela.filter((o) => o.id === obavestenje)
            setSelectedHotel(izabranoObavestenje[0].svrha)
        }
        if (tip === OBAVESTENJE_OSIGURANJE) {
            setSelectedObavestenjeOIzvrsenojUplatiOsiguranja(obavestenje)
            const izabranoObavestenje = obavestenjaOIzvrsenimUplatamaOsiguranja.filter((o) => o.id === obavestenje)
            setSelectedOsiguranje(izabranoObavestenje[0].svrha)
        }
        if (tip === OBAVESTENJE_PREVOZ) {
            setSelectedObavestenjeOIzvrsenojUplatiPrevoza(obavestenje)
            const izabranoObavestenje = obavestenjaOIzvrsenimUplatamaPrevoza.filter((o) => o.id === obavestenje)
            setSelectedPrevoz(izabranoObavestenje[0].svrha)
        }
    }

    return (
        <>
        <Toast ref={errorMessage}/>
        <Dialog 
            header={updateObavestenje ? 'Izmena obavestenja o svim izvrsenim uplatama' : 'Unos obavestenja o svim izvrsenim uplatama'} 
            visible={visibleDialogCreate} 
            onHide={hideCreateDialog}
            closable={false}
            ref={dialogRef}
        >
        <Form>
        <div className="add-dialog-first-row">
            <div>
                <label className="label" htmlFor="idObavestenja">ID obavestenja</label>
                <InputText color="gray" disabled id='idObavestenja' value={idObavestenjaDialog}/>
            </div>
            <div>
                <label className="label" htmlFor="datumUnosa">Datum unosa</label>
                <Calendar value={datumUnosaDialog} showIcon id='datumUnosa' name='datumUnosa' onChange={handleChangeDatumUnosa}/>
            </div>
        </div>
        <div className="add-dialog-first-row" style={{alignItems: 'center'}}>
            <div>
                <div>
                    <label className="label" htmlFor="svrhaObavestenja">Svrha obavestenja</label>
                </div>
                <InputTextarea value={svrhaObavestenja} id='svrhaObavestenja' name='svrhaObavestenja' onChange={handleChangeSvrhaObavestenja}/>
            </div>
            <div>
                <label className="label" htmlFor="idObavestenja">Primalac:</label>
                <Dropdown 
                    placeholder="Izaberite primaoca"
                    value={selectedKorisnik}
                    options={korisnici}
                    optionLabel='imePrezime'
                    optionValue='jmbg'
                    onChange={e => setSelectedKorisnik(e.target.value)}
                />
            </div>
        </div>
        <div>
            <h4>Relevantna obavestenja</h4>
            <div style={{display:'flex', flexDirection: 'column'}}>
                <div className="label-2">
                    <div className='label-2-item'>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <label className='label-2-item'>Obavestenje o izvrsenoj uplati hotela</label>
                            <div className='label-2-item'>
                                <Dropdown 
                                    placeholder="Izaberite obavestenje"
                                    value={selectedObavestenjeOIzvrsenojUplatiHotela}
                                    options={obavestenjaOIzvrsenimUplatamaHotela}
                                    optionLabel='svrha'
                                    optionValue='id'
                                    onChange={e => handleObavestenjeChange(OBAVESTENJE_HOTEL, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={selectedObavestenjeOIzvrsenojUplatiHotela === -1 ? 'label-2-item hidden-item' : 'label-2-item'}>
                        <Message text={selectedHotel} />
                    </div>
                </div>
                <div className="label-2">
                    <div className='label-2-item'>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <label className='label-2-item'>Obavestenje o izvrsenoj uplati prevoza</label>
                            <div className='label-2-item'>
                                <Dropdown 
                                    placeholder="Izaberite obavestenje"
                                    value={selectedObavestenjeOIzvrsenojUplatiPrevoza}
                                    options={obavestenjaOIzvrsenimUplatamaPrevoza}
                                    optionLabel='svrha'
                                    optionValue='id'
                                    onChange={e => handleObavestenjeChange(OBAVESTENJE_PREVOZ, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={selectedObavestenjeOIzvrsenojUplatiPrevoza === -1 ? 'label-2-item hidden-item' : 'label-2-item'}>
                        <Message text={selectedPrevoz}/>
                    </div>
                </div>
                <div className="label-2">
                    <div className='label-2-item'>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <label className='label-2-item'>Obavestenje o izvrsenoj uplati osiguranja</label>
                            <div className='label-2-item'>
                                <Dropdown 
                                placeholder="Izaberite obavestenje"
                                value={selectedObavestenjeOIzvrsenojUplatiOsiguranja}
                                options={obavestenjaOIzvrsenimUplatamaOsiguranja}
                                optionLabel='svrha'
                                optionValue='id'
                                onChange={e => handleObavestenjeChange(OBAVESTENJE_OSIGURANJE, e.target.value)}
                            />
                            </div>
                        </div>
                    </div>
                    <div className={selectedObavestenjeOIzvrsenojUplatiOsiguranja === -1 ? 'label-2-item hidden-item' : 'label-2-item'}>        
                        <Message text={selectedOsiguranje} />
                    </div>
                </div>
            </div>
        </div>
        <div className='add-dialog-third-row'>

            <div>
                <label style={{display: 'block'}}>Odgovorno lice:</label>
                <Dropdown 
                    placeholder="Izaberite radnika" 
                    value={selectedRadnik}
                    options={radnici}
                    optionLabel='imePrezime'
                    optionValue='sifraRadnika'
                    onChange={e => setSelectedRadnik(e.target.value)}
                />
            </div>
        </div>
        <div className="add-dialog-third-row" style={{justifyContent: 'space-around', marginTop: '30px'}}>
            <Button label="Odustani" className="p-button-danger" onClick={hideCreateDialog}/>
            <Button label={updateObavestenje ? 'Izmeni obavestenje' : 'Unesi obavestenje'} onClick={handleSubmitObavestenje}/>
        </div>
        </Form>
    </Dialog>
    </>
    )
}

export default ProstSlucajKoriscenjaDialog