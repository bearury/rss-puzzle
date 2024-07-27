import { IUser } from '../../../entity/user';
import { IElementParams } from '../../../utils/element-creator';
import View from '../../../utils/view';
import styles from './userName.module.scss';

export default class UserName extends View {
    constructor(userName: IUser) {
        const params: IElementParams = {
            tag: 'div',
            classNames: [styles.userName],
            textContent: userName.name + ' ' + userName.surname,
        };
        super(params);
    }
}
