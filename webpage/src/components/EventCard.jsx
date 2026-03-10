import Button from './Buttons';

export default function EventCard({title, description, date, place, eventImg, bookSeat}) {
    return (
        <div className="eventCard">
            <div className='eventCard__info img-overlay'>
                <img className="eventCard__img" src={eventImg}/>
                <div className='eventCard__text'>
                    <h3 className='eventCard__text--title'>{title}</h3>
                    <p className='eventCard__text--date'>{date}</p>
                    <p className='eventCard__text--place'>{place}</p>
                </div>
            </div>
            <p className='eventCard__description'>{description}</p>
            <Button className='eventCard__button' text="Book seat" variant="blue" onClick={bookSeat} />
        </div>
    )
}