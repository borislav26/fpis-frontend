import React, { useEffect, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import Form from './Form'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import './Slozen.css'
import StavkaRacunaCard from './StavkaRacunaCard'
import axios from 'axios'


const SlozenSlucajKoriscenjaDialog = props => {
    const { 
        visibleDialog, 
        setVisibleDialog, 
        racunSaBrutoCenom, 
        setRacunSaBrutoCenom,
        radnici, 
        mestaIzdavanja, 
        naciniPlacanja, 
        messageDialog, 
        updateRacun 
    } = props

    const [brojRacuna, setBrojRacuna] = useState('')
    const [datumIzdavanja, setDatumIzdavanja] = useState('')
    const [osnova, setOsnova] = useState('')
    const [selectedMestoIzdavanja, setSelectedMestoIzdavanja] = useState(-1)
    const [rokPlacanja, setRokPlacanja] = useState(-1)
    const [selectedNacinPlacanja, setSelectedNacinPlacanja] = useState(-1)
    const [selectedRadnik, setSelectedRadnik] = useState(-1)
    const [ukupanIznos, setUkupanIznos] = useState(0)
    const [stavkeRacuna, setStavkeRacuna] = useState([])

    const [nazivUsluge, setNazivUsluge] = useState('')
    const [redniBroj, setRedniBroj] = useState(0)
    const [netoCena, setNetoCena] = useState(0)
    const [porezNaUslugu, setPorezNaUslugu] = useState(0)
    const [marza, setMarza] = useState(0)
    const [brutoCena, setBrutoCena] = useState(0)
    const [izmeniStavku, setIzmeniStavku] = useState(false)


    useEffect(() => {
        if (racunSaBrutoCenom) {
           setBrojRacuna(racunSaBrutoCenom.brojRacuna)
           setDatumIzdavanja(new Date(racunSaBrutoCenom.datumIzdavanja))
           setOsnova(racunSaBrutoCenom.osnova)
           setRokPlacanja(new Date(racunSaBrutoCenom.rokPlacanja))
           setUkupanIznos(racunSaBrutoCenom.ukupnaBrutoCena)
           if (racunSaBrutoCenom.mestoIzdavanja) {
               setSelectedMestoIzdavanja(racunSaBrutoCenom.mestoIzdavanja.id)
           }
           if (racunSaBrutoCenom.nacinPlacanja) {
               setSelectedNacinPlacanja(racunSaBrutoCenom.nacinPlacanja.id)
           }
           if (racunSaBrutoCenom.radnik) {
               setSelectedRadnik(racunSaBrutoCenom.radnik.sifraRadnika)
           }
           if (racunSaBrutoCenom.stavke.length > 0) {
               setStavkeRacuna(racunSaBrutoCenom.stavke)
           }
        }
       
    }, [racunSaBrutoCenom])

    const hideDialog = () => {
        setRacunSaBrutoCenom(null)
        setVisibleDialog(false)
    }   

    const handleChangeDatumIzdavanja = (e) => {
        setDatumIzdavanja(e.target.value)
    }

    const handleChangeOsnova = (e) => {
        setOsnova(e.target.value)
    }

    const handleChangeRokPlacanja = (e) => {
        setRokPlacanja(e.target.value)
    }

    const handleSubmitDialog = async (e) => {
        e.preventDefault()
        if(stavkeRacuna.length === 0) {
            messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Ne mozete da unesete racun bez stavki', life: 6000})
            return
        }
        if(ukupanIznos === 0) {
            messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Ne mozete da dodate stavke cija je ukupna cena 0', life: 6000})
            return
        }
        if(selectedNacinPlacanja === -1) {
            messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Morate da izaberete odredjeni nacin placanja da bi uneli novi racun', life: 6000})
            return
        }
        if(selectedMestoIzdavanja === -1) {
            messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Morate da izaberete odredjenno mesto izdavanja da bi uneli novi racun', life: 6000})
            return
        }
        if(selectedRadnik === -1) {
            messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Morate da izaberete odgovorno lice da bi uneli novi racun', life: 6000})
            return
        }
        if(datumIzdavanja === '') {
            messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Morate da izaberete datum izdavanja da bi uneli novi racun', life: 6000})
            return
        }
        if(rokPlacanja === '') {
            messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Morate da odredite rok placanja da bi uneli novi racun', life: 6000})
            return
        }
        if(osnova === '') {
            messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Morate da unesete osnovu da bi uneli novi racun', life: 6000})
            return
        }
        if (updateRacun) {
            const { data } = await axios.put('http://localhost:5000/racuni-sa-bruto-cenom/update', {
                brojRacuna,
                rokPlacanja,
                datumIzdavanja,
                osnova,
                radnik: selectedRadnik,
                nacinPlacanja: selectedNacinPlacanja,
                mestaIzdavanja: selectedMestoIzdavanja,
                ukupnaBrutoCena: ukupanIznos,
                stavke: stavkeRacuna
            })
            if (data.error != null) {
                messageDialog.current.show({severity:'error', summary:'Greska', detail: data.error.message, life: 6000})
                return
            }
            messageDialog.current.show({
                severity:'success', 
                summary:'Uspesna akcija', 
                detail: 'Uspesno je izmenjen racun sa bruto cenom', 
                life: 6000
            })
            return
        } else {
            const { data } = await axios.post('http://localhost:5000/racuni-sa-bruto-cenom/create', {
                rokPlacanja,
                datumIzdavanja,
                osnova,
                radnik: selectedRadnik,
                nacinPlacanja: selectedNacinPlacanja,
                mestaIzdavanja: selectedMestoIzdavanja,
                ukupnaBrutoCena: ukupanIznos,
                stavke: stavkeRacuna
            })
            if (data.error != null) {
                messageDialog.current.show({severity:'error', summary:'Greska', detail: data.error.message, life: 6000})
                return
            }
            messageDialog.current.show({
                severity:'success', 
                summary:'Uspesna akcija', 
                detail: 'Uspesno je kreiran racun sa bruto cenom', 
                life: 6000
            })
        }
    }

    const handleNacinPlacanjaChange = (e) => {
        setSelectedNacinPlacanja(e.target.value)
    }

    const handleMestoIzdavanjaChange = (e) => {
        setSelectedMestoIzdavanja(e.target.value)
    }
 
    const handleRadnikChange = (e) => {
        setSelectedRadnik(e.target.value)
    }

    const handleRacunanjeBrutoCene = (e) => {
        e.preventDefault()
        if (!parseFloat(netoCena) || netoCena < 1) {
            messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Neto cena nema ispravnu vrednost', life: 6000})
            return
        } 

        if (!parseInt(porezNaUslugu) || porezNaUslugu < 1 || porezNaUslugu > 25) {
            messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Porez na uslugu nema ispravnu vrednost', life: 6000})
            return
        }

        if (!parseFloat(marza) || marza < 1) {
            messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Marza nema ispravnu vrednost', life: 6000})
            return
        }

        const bruto = parseInt(netoCena * (1 + (porezNaUslugu / 100))) + parseInt(marza) 
        setBrutoCena(bruto)
        
    }

    const setStavkaRacunaEdit = (stavka) => {
        setIzmeniStavku(true)
        setNazivUsluge(stavka.nazivStavke)
        setRedniBroj(stavka.redniBroj)
        setNetoCena(stavka.netoCena)
        setPorezNaUslugu(stavka.porezNaUslugu)
        setMarza(stavka.marza)
        setBrutoCena(stavka.brutoCena)
    }

    const deleteStavkaRacuna = (stavka) => {
        const newStavke = stavkeRacuna.filter((s) => s.redniBroj !== stavka.redniBroj)
        setStavkeRacuna(newStavke)
    }

    const handleUnosNoveStavkeRacuna = (e) => {
        e.preventDefault()
        if (izmeniStavku) {
            if (nazivUsluge.length < 1) {
                messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Naziv usluge nema ispravnu vrednost', life: 6000})
                return
            }
            if (!parseFloat(netoCena) || netoCena < 1) {
                messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Neto cena nema ispravnu vrednost', life: 6000})
                return
            } 
    
            if (!parseInt(porezNaUslugu) || porezNaUslugu < 1 || porezNaUslugu > 25) {
                messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Porez na uslugu nema ispravnu vrednost', life: 6000})
                return
            }
    
            if (!parseFloat(marza) || marza < 1) {
                messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Marza nema ispravnu vrednost', life: 6000})
                return
            }

            stavkeRacuna.forEach((stavka) => {
                if (stavka.redniBroj === redniBroj) {
                    stavka.nazivStavke = nazivUsluge
                    stavka.netoCena = netoCena
                    stavka.netoCena = netoCena
                    stavka.porezNaUslugu = porezNaUslugu
                    stavka.marza = marza
                    const bruto = parseInt(netoCena * (1 + (porezNaUslugu / 100))) + parseInt(marza) 
                    stavka.brutoCena = bruto
                    stavka.brojRacuna = brojRacuna
                    return
                }
            })
            setNazivUsluge('')
            setRedniBroj(0)
            setNetoCena(0)
            setPorezNaUslugu(0)
            setMarza(0)
            setBrutoCena(0)
            setIzmeniStavku(false)
            return
        }
        let maxRedniBroj = 0
        if (stavkeRacuna.length > 0) {
            maxRedniBroj = stavkeRacuna[stavkeRacuna.length - 1].redniBroj
        }

        const postojeciRedniBroj = stavkeRacuna.filter((stavka) => stavka.redniBroj === redniBroj)
        if (!parseInt(redniBroj) || redniBroj < 1 ||  postojeciRedniBroj.length > 0 || parseInt(maxRedniBroj) + 1 !== parseInt(redniBroj)) {
            messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Redni broj nema ispravnu vrednost', life: 6000})
            return
        }
        if (nazivUsluge.length < 1) {
            messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Naziv usluge nema ispravnu vrednost', life: 6000})
            return
        }
        if (!parseFloat(brutoCena) || brutoCena < 1) {
            messageDialog.current.show({severity:'error', summary:'Greska', detail: 'Ne mozete uneti novu stavku bez prethodno izracunate bruto cene', life: 6000})
            return
        }
        setStavkeRacuna([...stavkeRacuna, {nazivStavke: nazivUsluge, redniBroj, netoCena, porezNaUslugu, marza, brutoCena, brojRacuna}])
        setNazivUsluge('')
        setRedniBroj(0)
        setNetoCena(0)
        setPorezNaUslugu(0)
        setMarza(0)
        setBrutoCena(0)
    }

    const izracunajUkupanIznos = (e) => {
        e.preventDefault()
        let ukupno = 0
        stavkeRacuna.forEach((stavka) => ukupno += stavka.brutoCena)
        setUkupanIznos(ukupno)
    }

    const izracunajUpdateIznos = () => {
        let ukupno = 0
        stavkeRacuna.forEach((stavka) => ukupno += stavka.brutoCena)
        console.log(ukupno)
        return ukupno
    }

    return (
        <>
        <Dialog 
            header={updateRacun ? 'Izmena racuna sa bruto cenom' : 'Unos racuna sa bruto cenom'} 
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
                <Calendar value={datumIzdavanja} showIcon id='datumIzdavanja' name='datumIzdavanja' onChange={handleChangeDatumIzdavanja}/>
            </div>
        </div>
        <div className="add-dialog-first-row" style={{alignItems: 'center'}}>
            <div>
                <div>
                    <label className="label" htmlFor="osnova">Osnova</label>
                </div>
                <InputTextarea value={osnova} id='osnova' name='osnova' onChange={handleChangeOsnova}/>
            </div>
            <div>
                <label className="label" htmlFor="idObavestenja">Mesto izdavanja:</label>
                <Dropdown 
                    placeholder="Izaberite mesto izdavanja"
                    value={selectedMestoIzdavanja}
                    options={mestaIzdavanja}
                    optionLabel='nazivMestaIzdavanja'
                    optionValue='id'
                    onChange={handleMestoIzdavanjaChange}
                />
            </div>
        </div>
        <div className="add-dialog-first-row" style={{alignItems: 'center'}}>
            <div>
                <label className="label" htmlFor="rokPlacanja">Rok placanja</label>
                <Calendar value={rokPlacanja} showIcon id='rokPlacanja' name='datumIzdavanja' onChange={handleChangeRokPlacanja}/>
            </div>
            <div>
                <label className="label" htmlFor="idObavestenja">Nacin placanja:</label>
                <Dropdown 
                    placeholder="Izaberite nacin placanja"
                    value={selectedNacinPlacanja}
                    options={naciniPlacanja}
                    optionLabel='opisNacinaPlacanja'
                    optionValue='id'
                    onChange={handleNacinPlacanjaChange}
                />
            </div>
        </div>
        <hr></hr>
            <div className="add-dialog-first-row" style={{alignItems: 'center'}}>
                <div>
                    <div>
                        <label htmlFor='nazivUsluge'>Unesi naziv usluge:</label>
                    </div>
                    <InputText id='nazivUsluge' value={nazivUsluge !== '' ? nazivUsluge : ''} onChange={(e) => setNazivUsluge(e.target.value)}/>
                </div>
                <div>
                    <div>
                        <label htmlFor='nazivUsluge'>Redni broj:</label>
                    </div>
                    <InputText id='nazivUsluge' disabled={izmeniStavku} value={redniBroj !== 0 ? redniBroj : ''} onChange={(e) => setRedniBroj(e.target.value)}/>
                </div>
                <div>
                    <div>
                        <label htmlFor='nazivUsluge'>Neto cena:</label>
                    </div>
                    <InputText id='nazivUsluge' value={netoCena !== 0 ? netoCena : ''} onChange={(e) => setNetoCena(e.target.value)}/>
                </div>
                <div>
                    <div>
                        <label htmlFor='nazivUsluge'>Porez na uslugu:</label>
                    </div>
                    <InputText id='nazivUsluge' value={porezNaUslugu !== 0 ? porezNaUslugu : ''} onChange={(e) => setPorezNaUslugu(e.target.value)}/>
                </div>
            </div>
            <div className="add-dialog-first-row" style={{alignItems: 'center'}}>
                <div>
                    <div>
                        <label htmlFor='nazivUsluge'>Marza:</label>
                    </div>
                    <InputText id='nazivUsluge' value={marza !== 0 ? marza : ''} onChange={(e) => setMarza(e.target.value)}/>
                </div>
                <div>
                    <Button label='Izracunaj cenu za bruto stavku' onClick={handleRacunanjeBrutoCene}/>
                </div>
                <div>
                    <div>
                        <label htmlFor='brutoCena'>Bruto cena:</label>
                    </div>
                    <InputText color="gray" disabled id='brutoCena' value={brutoCena !== 0 ? brutoCena : ''} onChange={(e) => setBrutoCena(e.target.value)}/>
                </div>
                <div>
                    <Button label={izmeniStavku ? 'Izmeni stavku' : 'Unesi stavku'} onClick={handleUnosNoveStavkeRacuna}/>
                </div>
            </div>
            <div className='stavke-racuna-box'>
                {stavkeRacuna.map((item) => <StavkaRacunaCard key={item.redniBroj} stavka={item} handleEditStavka={setStavkaRacunaEdit} handleDeleteStavka={deleteStavkaRacuna}/>)}
            </div>
        <hr></hr>
        <div className="add-dialog-first-row" style={{alignItems: 'center'}}>
            <div>
                <label className="label" htmlFor="idObavestenja">Odgovorno lice:</label>
                <Dropdown 
                    placeholder="Izaberite odgovorno lice"
                    value={selectedRadnik}
                    options={radnici}
                    optionLabel='imePrezime'
                    optionValue='sifraRadnika'
                    onChange={handleRadnikChange}
                />
            </div>
            <div>
                <Button label='Izracunaj ukupan trosak' onClick={izracunajUkupanIznos} className='p-button-info'/>
            </div>
            <div>
                <label className="label" htmlFor="ukupanIznos">Ukupan iznos</label>
                <InputText color="gray" disabled id='ukupanIznos' value={ukupanIznos !== 0 ? ukupanIznos : ''}/>
            </div>
        </div>
        <div className="add-dialog-third-row" style={{justifyContent: 'space-around', marginTop: '30px'}}>
            <Button label="Odustani" className="p-button-danger" onClick={hideDialog}/>
            <Button label={updateRacun ? 'Izmeni racun sa bruto cenom' : 'Unesi racun sa bruto cenom'} onClick={(e) => {handleSubmitDialog(e); hideDialog()}}/>
        </div>
        </Form>
    </Dialog>
        </>
    )
}

export default SlozenSlucajKoriscenjaDialog