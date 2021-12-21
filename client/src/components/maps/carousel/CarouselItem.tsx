interface CaruselItemProp {
    id: string;
}
function CarouselItem(props: CaruselItemProp) {
    const imgEndpoint = process.env.REACT_APP_AREA_IMAGES;
    if (!imgEndpoint) {
        console.log("REACT_APP_AREA_IMAGES not defined");
        return null;
    }
    const url = `http://${imgEndpoint}/${props.id}_carousel.png`

    return (
        <div className="card">
            <div className="card-image">
                <figure className="image is-16by9">
                    <img height={180} src={url} alt="Carousel preview" />
                </figure>
            </div>
        </div>
    )
}

export { CarouselItem }
