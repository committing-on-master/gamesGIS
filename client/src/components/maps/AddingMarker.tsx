import { useAppDispatch } from "../../store/hooks";
import { createMarker } from "../../store/markers/slice";
import { useForm, SubmitHandler } from "react-hook-form";
import { SchemaValidation } from "../schemas/schemaValidation";

type Inputs = {
    name: string
};

function AddingMarker() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const dispatch = useAppDispatch();
    const onSubmit: SubmitHandler<Inputs> = data => {
        dispatch(createMarker(data.name));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <label>Marker name</label>
            <input type="text" placeholder="...marker name" {...register("name", SchemaValidation.MarkerName)}/>
            {errors.name && <p>{errors.name.message}</p>}
            <input type="submit" />
        </form>
    )
}

export { AddingMarker };
