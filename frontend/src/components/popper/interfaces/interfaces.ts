import {PopperTypesEnum} from '../popper-types.enum';

export interface IProps {
    PopperPlacementType: PopperTypesEnum;
    TransitionProps?: {
        in: boolean,
        onEnter: () => {},
        onExited: () => {}
    };
}