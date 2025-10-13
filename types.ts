

type user = {
    id: string;
    email: string;
    balance: number;
    last_reset: Date;
};


type token = {
    user_id: string;
    token: string;
    expiration_date: Date;
};

export { user, token };