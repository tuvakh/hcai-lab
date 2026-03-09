/* import Button from './Button';
 */
export default function EventCard({title, description, date, eventImg, bookSeat}) {
    return (
        <div className="eventCard">
            <img className="eventCard__img" src={eventImg}/>
            <div className='eventCard__info'>
                <h3 className='eventCard__title'>{title}</h3>
                <p className='eventCard__date'>{date}</p>
            </div>
            <p className='eventCard__description'>{description}</p>
            {/* <Button text="Book seat" onClick={bookSeat} /> */}
        </div>
    )
}