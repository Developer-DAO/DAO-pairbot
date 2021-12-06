import { ToadScheduler, SimpleIntervalJob, Task } from 'toad-scheduler';
import { supabase } from '../database'
import moment from 'moment';
import { client } from '../index';
import dotenv from 'dotenv'
import { TextChannel,} from 'discord.js';

dotenv.config();

const Scheduler = () => {
    const scheduler = new ToadScheduler();

    const removeExpiredInvitesTask = new Task('Remove expired invites', async () => {
        console.log('Removing expired invites.');
        const { error } = await supabase
        .from('invites')
        .delete()
        .lte('created_at', moment().subtract(1, 'days').format())

        if (error != null) {
            console.log(error.message);
        }
    });

    const removeExpiredInvites = new SimpleIntervalJob(
        { hours: 12, runImmediately: true },
        removeExpiredInvitesTask,
        'id_1'
        );
        
    const removeArchivedThreadsTask = new Task('Remove archived threads', async () => {
        console.log('Removing archived channels.')
        const mainChannel = client.channels.cache.get('913130959069663333');
        const archivedThreads = await (mainChannel as TextChannel)?.threads.fetchArchived() 

        if (!archivedThreads) return;

        archivedThreads?.threads.forEach((channel) => {
            channel.delete(channel.id);
            console.log(`${channel.name} successfully deleted!`);
        });
    })
        

    const removeArchivedThreads = new SimpleIntervalJob(
        { hours: 12, runImmediately: true },
        removeArchivedThreadsTask,
        'id_2'
        );

    scheduler.addSimpleIntervalJob(removeExpiredInvites);
    scheduler.addSimpleIntervalJob(removeArchivedThreads);
}
export default Scheduler;