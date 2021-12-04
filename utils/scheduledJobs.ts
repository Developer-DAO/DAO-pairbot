import { ToadScheduler, SimpleIntervalJob, Task } from 'toad-scheduler';
import { supabase } from '../database'
import moment from 'moment';

const Scheduler = () => {
const scheduler = new ToadScheduler();

const task = new Task('Remove expired invites', async () => {
    console.log('Task triggered');

    const { error } = await supabase
    .from('invites')
    .delete()
    .lte('created_at', moment().subtract(1, 'days').format())

    if (error != null) {
      console.log(error.message);
    }
});

const removeExpiredInvites = new SimpleIntervalJob(
    { seconds: 30, runImmediately: true },
    task,
    'id_1'
    );
    
    scheduler.addSimpleIntervalJob(removeExpiredInvites);
}
    
export default Scheduler;