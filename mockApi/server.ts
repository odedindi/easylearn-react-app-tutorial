import express from 'express';
import cors from 'cors';
import { createUniqueId } from '../src/utils/createUniqueId';
import { GenderId, genderIds } from '../src/pages/auth/registerPage';
import { z } from 'zod';
import {
    apiV1ErrorMessageKeys,
    ApiV1ErrorMessage,
    sanitizeApiV1ErrorMessage,
} from '../src/packages/core/api-v1/core/errorMessages';
const port = 9000;
const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));

const createErrorMessage = (messageId: string, translationId: ApiV1ErrorMessage) => ({
    id: messageId,
    severity: 'error',
    translation: {
        id: translationId,
    },
});

const zNonemptyString = z.string().refine((s) => !!s?.trim().length, { message: apiV1ErrorMessageKeys.required });
const zGender = z
    .string()
    .refine((gender) => genderIds.has(gender as GenderId), { message: apiV1ErrorMessageKeys.invalidValue });

app.post('/api/v1/auth/register', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    console.log('POST /api/v1/auth/register', req.body);
    const parsedBody = z
        .object({
            gender: zGender.pipe(zNonemptyString),
            username: z.string().pipe(zNonemptyString),
            email: z.string().email(apiV1ErrorMessageKeys.invalidEmail).pipe(zNonemptyString),
            password: z.string().pipe(zNonemptyString),
        })

        .safeParse(req.body);

    const generalMessages = [
        createErrorMessage(
            createUniqueId(),
            parsedBody.success ? apiV1ErrorMessageKeys.userWasCreated : apiV1ErrorMessageKeys.formErrors
        ),
    ];
    const fieldMessages = (parsedBody.error?.errors ?? []).map(({ message, path }, i) => {
        const sanitizedMessage = sanitizeApiV1ErrorMessage(message);
        return {
            path,
            message: createErrorMessage(`message-id-${i + 1}`, sanitizedMessage),
        };
    });

    res.status(parsedBody.success ? 201 : 400);
    res.header('Content-Type', 'application/json');
    const responseBody = {
        success: parsedBody.success,
        generalMessages,
        fieldMessages,
        data: parsedBody.data
            ? {
                  apiKey: 'foo',
                  user: { id: 'fbfe874c-ea8f-4cc1-bd4e-f07bedc30487', username: parsedBody.data.username },
              }
            : undefined,
    };
    res.write(JSON.stringify(responseBody));
    res.send();
});

app.listen(port, () => {
    console.log(`Mock-API is running at: http://localhost:${port}`);
});
