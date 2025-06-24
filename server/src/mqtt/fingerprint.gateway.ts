import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    namespace: '/fingerprint',
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

export class FingerprintGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(FingerprintGateway.name);

    handleConnection(client: Socket) {
        this.logger.log(`🔌 Client connected: ${client.id} from ${client.handshake.address}`);

        // Send welcome message to newly connected client
        client.emit('connected', {
            message: 'Connected to fingerprint server',
            clientId: client.id,
            timestamp: Date.now()
        });
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`🔌 Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('subscribe_employee')
    handleSubscribeToEmployee(
        @MessageBody() data: { employeeID: number },
        @ConnectedSocket() client: Socket
    ) {
        const room = `employee_${data.employeeID}`;
        client.join(room);
        this.logger.log(`👤 Client ${client.id} subscribed to employee ${data.employeeID}`);

        client.emit('subscribed', { employeeID: data.employeeID, room });
    }

    // Methods to emit events to specific employees
    emitToEmployee(employeeID: number, event: string, data: any) {
        const room = `employee_${employeeID}`;
        this.server.to(room).emit(event, {
            type: event,
            ...data,
            timestamp: Date.now()
        });
        this.logger.log(`📤 Emitted ${event} to employee ${employeeID} websocket client:`, data);
    }

    // Specific methods for fingerprint events
    enrollmentStarted(employeeID: number, fingerID: number) {
        this.emitToEmployee(employeeID, 'enroll_started', { employeeID, fingerID });
    }

    enrollmentStep(employeeID: number, step: 'remove_finger' | 'place_again') {
        this.emitToEmployee(employeeID, 'enroll_step', { employeeID, step });
    }

    enrollmentSuccess(employeeID: number, fingerID: number) {
        this.emitToEmployee(employeeID, 'enroll_success', { employeeID, fingerID });
    }

    enrollmentFailure(employeeID: number, error: string) {
        this.emitToEmployee(employeeID, 'enroll_failure', { employeeID, error });
    }
}
